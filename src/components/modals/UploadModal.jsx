import { MdClose } from 'react-icons/md';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { uploadData } from 'aws-amplify/storage';
import '@aws-amplify/ui-react/styles.css';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

/*
 * Converts the first page of a given PDF file to a PNG image blob.
 *
 * This function uses pdf.js to load the PDF from a `File` object,
 * renders the first page onto a canvas, and exports it as a PNG blob.
 * It is primarily used to generate a thumbnail or preview of the uploaded PDF.
 *
 * @async
 * @function convertPdfToImage
 * @param {File} file - A PDF file object selected by the user.
 * @returns {Promise<Blob>} A promise that resolves to a PNG image blob of the first page.
 *
 * @example
 * const imageBlob = await convertPdfToImage(file);
 */
const convertPdfToImage = async (file) => {
    const fileURL = URL.createObjectURL(file);
    const pdf = await pdfjsLib.getDocument(fileURL).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
};

/*
 * A modal component for uploading PDF files, converting the first page to an image, uploading both to S3, 
 * and sending a file processing request to an API. The file can then be clicked to navigate to its viewer.
 *
 * This component uses AWS Amplify's FileUploader for resumable uploads. It also hashes the uploaded file's content
 * to generate a consistent identifier and converts the first page of the PDF to a PNG thumbnail using pdf.js.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.userAttributes - The current user’s attributes, used to organize uploads by user ID.
 * @param {boolean} props.isOpen - Whether the modal is visible or not.
 * @param {() => void} props.onClose - Callback function when the modal should be closed.
 *
 * @returns {React.ReactElement|null} A modal for file upload, or `null` if not open.
 *
 * @example
 * <UploadModal
 *   userAttributes={user}
 *   isOpen={isUploadOpen}
 *   onClose={() => setUploadOpen(false)}
 * />
 */
function UploadModal({ userAttributes, isOpen, onClose }) {
    if (!isOpen) return null;

    const filepath = userAttributes
        ? `unannotated/${userAttributes.sub}/`
        : 'unannotated/';

    const fileMappings = useRef(new Map());
    const navigate = useNavigate();
    /*
    * Processes the uploaded file by converting it to an image, hashing the file name, and uploading it to S3.
    *
    * @function
    */
    function processFile(userAttributes) {
        return ({ file }) => {
            const fileExtension = file.name.split('.').pop();

            const imagepath = `unannotated/${userAttributes.sub}/`;

            return file
                .arrayBuffer()
                .then((filebuffer) =>
                    window.crypto.subtle.digest('SHA-1', filebuffer),
                )
                .then(async (hashBuffer) => {
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray
                        .map((a) => a.toString(16).padStart(2, '0'))
                        .join('');

                    // Convert PDF to image
                    // Set worker source explicitly
                    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
                        'pdfjs-dist/build/pdf.worker.min.mjs',
                        import.meta.url,
                    ).toString();

                    const imageBlob = await convertPdfToImage(file);
                    const imageFilename = `${imagepath}${hashHex}.png`;

                    // Upload image to S3
                    try {
                        const result = await uploadData({
                            path: imageFilename,
                            data: imageBlob,
                        });
                    } catch (error) {
                        console.error('Error uploading image:', error);
                    }

                    fileMappings.current.set(hashHex, file.name);

                    return {
                        file,
                        key: `${hashHex}.${fileExtension}`,
                        metadata: {
                            name: file.name.split('.')[0],
                        },
                    };
                });
        };
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white sm:w-3/5 sm:max-w-lg lg:w-2/5 lg:max-w-3xl p-6 rounded-lg shadow-lg">
                <div className=" flex flex-row mb-6">
                    <h2 className="text-2xl font-bold">Upload File</h2>
                    <button
                        className=" ml-auto text-black hover:text-red-500"
                        onClick={onClose}
                        aria-label="close-upload-button"
                    >
                        <MdClose size="30" />
                    </button>
                </div>
                <FileUploader
                    acceptedFileTypes={['.pdf']}
                    path={filepath}
                    maxFileCount={1}
                    isResumable={true}
                    autoUpload={false}
                    processFile={processFile(userAttributes)}
                    onUploadSuccess={async ({ key }) => {
                        let [, user_id, file_id] = key.split('/');

                        try {
                            let url = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/pdf-proccessing/request`;
                            await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-API-KEY': import.meta.env.VITE_API_KEY,
                                },
                                body: JSON.stringify({
                                    user_id: user_id,
                                    file_id: file_id
                                        .split('.')
                                        .slice(0, -1)
                                        .join('.'),
                                    bucket_name: import.meta.env
                                        .VITE_BUCKET_NAME,
                                }),
                            });
                        } catch (error) {
                            console.log(error);
                        }

                        const elements = document.querySelectorAll(
                            '.amplify-fileuploader__file__name',
                        );

                        for (const el of elements) {
                            const id = file_id.split('.')[0];
                            const name = fileMappings.current.get(id);
                            if (el.innerHTML === name) {
                                el.onclick = () => {
                                    navigate('/file/' + id);
                                };
                                el.style.cursor = 'pointer';
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default UploadModal;
