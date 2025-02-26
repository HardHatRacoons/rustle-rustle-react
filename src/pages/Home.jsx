import React, { useState, useEffect } from 'react';
import { MdClose } from "react-icons/md";
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import GoogleSignOut from '../components/GoogleSignOut';
import { useUser } from '../components/UserContext';
import { list, getUrl } from 'aws-amplify/storage';

function LoginNavbar() {
    const userAttributes = useUser();

    return (
        <div className="w-full h-20 flex text-white align-items-center p-5">
            <div className="text-4xl grow-10 text-nowrap mx-2">
                {userAttributes ? `Welcome, ${userAttributes.given_name}` : "Loading..."}
            </div>
            <GoogleSignOut />
        </div>
    )
}

function UploadModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    
    const userAttributes = useUser();
    // console.log("userAttributes in upload modal", userAttributes)
    const filepath = userAttributes ? `unannotated/${userAttributes.sub}/` : "unannotated/";
    // console.log("filepath in upload modal", filepath);

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white w-2/5 max-w-3xl p-6 rounded-lg shadow-lg">
                <div className=" flex flex-row mb-6">
                    <h2 className="text-2xl font-bold">Upload File</h2>
                    <button className=" ml-auto text-black hover:text-red-500" onClick={onClose}>
                        <MdClose size="30" />
                    </button>
                </div>
                <FileUploader
                    acceptedFileTypes={['.pdf']}
                    path={filepath}
                    maxFileCount={1}
                    isResumable={true}
                    autoUpload={false}
                />
            </div>
        </div>
    );
}

function FileList() {
    const userAttributes = useUser();
    const [files, setFiles] = useState({}); // file contains {filename: path} pairs
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait until userAttributes is available
        if (!userAttributes) return;

        const filepath = `unannotated/${userAttributes.sub}/`;

        const fetchFiles = async () => {
            setLoading(true); // Start loading
            try {
                const result = await list({
                    path: filepath,
                    options: { listAll: true },
                });

                const fileData = {};
                result.items.forEach((file) => {
                    const filename = file.path.split("/").pop().slice(0, -4); // Extract filename
                    fileData[filename] = file.path;
                });

                setFiles(fileData);
            } catch (error) {
                console.error("Error listing files:", error);
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
            <h2>Unannotated Files: </h2>
            {Object.keys(files).length === 0 ? (
                <p>No files found.</p>
            ) : (
                <ul>
                    {Object.entries(files).map(([filename, path]) => (
                        <li key={filename}>
                            {filename}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="h-full bg-sky-300 flex flex-col">

            <LoginNavbar />

            <div className="bg-sky-200 grow">
                <div className="m-6 flex flex-row bg-white p-8 rounded-lg">
                    <h1 className="text-4xl font-bold"> Gallery </h1>

                    <button className="ml-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600" onClick={() => setIsModalOpen(true)}>
                        Upload
                    </button>
                </div>
                <div>
                    <FileList />
                </div>
            </div>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            
        </div>
    )
}

export default Home
