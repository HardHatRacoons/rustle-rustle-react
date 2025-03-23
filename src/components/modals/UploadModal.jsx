import { MdClose } from 'react-icons/md';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { uploadData } from 'aws-amplify/storage';
import '@aws-amplify/ui-react/styles.css';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Convert first page of PDF to an image
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

function processFile(userAttributes) {
    return ({ file }) => {
        const fileExtension = file.name.split('.').pop();

        const filepath = `annotated/${userAttributes.sub}/`

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
                const imageFilename = `${filepath}${hashHex}.png`;

                // Upload image to S3
                try {
                    const result = await uploadData({
                        path: imageFilename,
                        data: imageBlob,
                    });
                    console.log('Uploaded image to S3:', result);
                } catch (error) {
                    console.error('Error uploading image:', error);
                }

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

function UploadModal({ userAttributes, isOpen, onClose }) {
    if (!isOpen) return null;

    const filepath = userAttributes
        ? `unannotated/${userAttributes.sub}/`
        : 'unannotated/';

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white w-2/5 max-w-3xl p-6 rounded-lg shadow-lg">
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
                />
            </div>
        </div>
    );
}

export default UploadModal;
