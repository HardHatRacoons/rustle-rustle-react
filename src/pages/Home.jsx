import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import GoogleSignOut from '../components/GoogleSignOut';
import { useUser } from '../components/UserContext';
import { list } from 'aws-amplify/storage';
import { useNavigate } from 'react-router';

function LoginNavbar() {
    const userAttributes = useUser();

    return (
        <div className="w-full h-20 flex text-white align-items-center p-5">
            <div className="text-4xl grow-10 text-nowrap mx-2">
                {userAttributes
                    ? `Welcome, ${userAttributes.given_name}`
                    : 'Loading...'}
            </div>
            <GoogleSignOut />
        </div>
    );
}

const processFile = async ({ file }) => {
    const fileExtension = file.name.split('.').pop();

    return file
        .arrayBuffer()
        .then((filebuffer) => window.crypto.subtle.digest('SHA-1', filebuffer))
        .then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map((a) => a.toString(16).padStart(2, '0'))
                .join('');
            return {
                file,
                key: `${hashHex}.${fileExtension}`,
                metadata: {
                    name: file.name.split('.')[0],
                },
            };
        });
};

function UploadModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const userAttributes = useUser();
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
                    processFile={processFile}
                />
            </div>
        </div>
    );
}

function FileList({ folder }) {
    const userAttributes = useUser();
    const [files, setFiles] = useState({}); // file contains {filename: path} pairs
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        // Wait until userAttributes is available
        if (!userAttributes) return;

        const filepath = `${folder}/${userAttributes.sub}/`;

        const fetchFiles = async () => {
            setLoading(true); // Start loading
            try {
                const result = await list({
                    path: filepath,
                    options: { listAll: true },
                });

                const fileData = {};
                result.items.forEach((file) => {
                    const filename = file.path.split('/').pop().slice(0, -4); // Extract filename
                    fileData[filename] = file.path;
                });

                setFiles(fileData);
            } catch (error) {
                console.error('Error listing files:', error);
            } finally {
                setLoading(false); // Stop loading after fetching files
            }
        };

        fetchFiles();
    }, [userAttributes]); // Ensure effect runs only when userAttributes is available

    // Show a loading message until both userAttributes and files are fetched
    if (!userAttributes || loading) {
        return <div>Loading files...</div>;
    }

    return (
        <div>
            {Object.keys(files).length === 0 ? (
                <p>No files found.</p>
            ) : (
                <ul>
                    {Object.entries(files).map(([filename, path]) => (
                        <li key={filename} className="cursor-pointer">
                            <a onClick={() => navigate(`/file/${filename}`)}>
                                {filename}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Single state for refreshing

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRefreshKey((prev) => prev + 1); // Incrementing key triggers re-render
    };

    return (
        <div className="h-full bg-sky-300 flex flex-col">
            <LoginNavbar />

            <div className="bg-sky-200 grow">
                <div className="m-6 flex flex-row bg-white p-8 rounded-lg">
                    <h1 className="text-4xl font-bold"> Gallery </h1>

                    <button
                        className="ml-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Upload
                    </button>
                </div>
                <div>
                    <h2>Annotated Files: </h2>
                    <FileList
                        key={`annotated-${refreshKey}`}
                        folder="annotated"
                    />
                    <h2>Unannotated Files: </h2>
                    <FileList
                        key={`unannotated-${refreshKey}`}
                        folder="unannotated"
                    />
                </div>
            </div>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => handleCloseModal()}
            />
        </div>
    );
}

export default Home;
