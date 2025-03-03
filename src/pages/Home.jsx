import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { FaTrashAlt } from "react-icons/fa";
import { HiMiniSparkles } from "react-icons/hi2";
import { IoMdRefreshCircle } from "react-icons/io";
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import GoogleSignOut from '../components/GoogleSignOut';
import { useUser } from '../components/UserContext';
import { list, getProperties, remove } from 'aws-amplify/storage';
import { useNavigate } from 'react-router';


function LoginNavbar() {
    const userAttributes = useUser();

    return (
        <div className="w-full h-20 flex text-white align-items-center p-5">
            <div className="flex flex-row gap-2 text-4xl grow-10 text-nowrap mx-2">
                <HiMiniSparkles />
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
                    processFile={processFile}
                />
            </div>
        </div>
    );
}

function FileList({ folder }) {
    const userAttributes = useUser();
    const [files, setFiles] = useState({}); // file contains {fileID: docName} pairs
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleDeleteFile = async (fileId, fileName) => {
        if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;
    
        try {
            // Construct the full file path
            const filePath = `${folder}/${userAttributes.sub}/${fileId}.pdf`; // Adjust extension as needed
            
            // Call Amplify remove function
            await remove({ 
                path: filePath, 
                bucket: 'assignedNameInAmplifyBackend' // Ensure this matches your Amplify storage setup
            });
    
            // Update state to remove the deleted file
            setFiles(prevFiles => {
                const updatedFiles = { ...prevFiles };
                delete updatedFiles[fileId];
                return updatedFiles;
            });
    
            console.log(`File "${fileName}" deleted successfully.`);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    useEffect(() => {
        // Wait until userAttributes is available
        if (!userAttributes) return;

        const filepath = `${folder}/${userAttributes.sub}/`;

        const fetchFiles = async () => {
            setLoading(true); // Start loading
            // get the file name
            try {
                const result = await list({
                    path: filepath,
                    options: { listAll: true },
                });

                const fileData = {}; // Stores fileID -> metadata name mapping
                for (const file of result.items) {
                    const fileID = file.path.split('/').pop().slice(0, -4); // Extract fileID

                    try {
                        const metadataResult = await getProperties({
                            path: file.path, // Use the file path to get metadata
                        });

                        const docName = metadataResult.metadata && metadataResult.metadata.name
                            ? metadataResult.metadata.name
                            : 'Document'; // Default name if no metadata found

                        fileData[fileID] = docName; // Store fileID -> metadata name
                    } catch (error) {
                        console.error('Error fetching metadata:', error);
                        fileData[fileID] = 'Document'; // Fallback to default name
                    }
                }

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
        return <div className="bg-white p-6 rounded-lg text-lg font-bold text-sky-900" >Loading files...</div>;
    }

    return (
        <div className="mt-3 mb-6 bg-white p-6 rounded-lg bg-opacity-50 overflow-y-auto">
            {Object.keys(files).length === 0 ? (
                <p className="text-lg font-bold text-sky-900">No files found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(files).map(([fileId, fileName]) => (
                        <div key={fileId} 
                             className="cursor-pointer bg-sky-100 shadow-lg rounded-lg px-4 pt-40 transition transform hover:scale-102 hover:shadow-xl" 
                             onClick={() => navigate(`/file/${fileId}`)}>
                            <img src={`https://placehold.co/600x400/ECECEC/CACACA?text=placeholder`} alt={fileName} className="absolute top-0 left-0 w-full h-40 object-cover rounded-t-lg" />
                            <div className="flex flex-row py-2 content-center">
                                <p className="text-lg font-bold text-sky-900">
                                    {fileName}
                                </p>
                                <button 
                                    className="ml-auto hover:text-red-500 hover:cursor-pointer"
                                    onClick={(event) => {
                                            event.stopPropagation(); // Prevent card click event
                                            handleDeleteFile(fileId, fileName);
                                    }}>
                                    <FaTrashAlt size="20"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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

            <div className="bg-sky-200 grow overflow-y-hidden">
                <div className="m-6 flex flex-row bg-white p-8 rounded-lg">
                    <h1 className="text-4xl font-bold text-sky-950"> Gallery </h1>

                    <button
                        className="ml-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="open-upload-button"
                    >
                        Upload
                    </button>
                </div>
                <div className="ml-6 mr-6">
                    <div className="flex flex-row justify-between">
                        <h2 className=" font-bold text-2xl text-sky-900">Annotated Files: </h2>
                        <IoMdRefreshCircle 
                            className="text-sky-900 hover:cursor-pointer hover:text-sky-700"
                            onClick={() => setRefreshKey((prev) => prev + 1)}
                            size = "30"
                        />
                    </div>
                    
                    <FileList
                        key={`annotated-${refreshKey}`}
                        folder="annotated"
                    />
                </div>
                <div className="ml-6 mr-6">
                    <h2 className="font-bold text-2xl text-sky-900">Unannotated Files: </h2>
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
