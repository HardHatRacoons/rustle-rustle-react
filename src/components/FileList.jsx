import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { list, getProperties } from 'aws-amplify/storage';
import { useNavigate } from 'react-router';

function FileList({ userAttributes, folder, setSelectedFile, setIsDeleteModalOpen }) {
    const [files, setFiles] = useState({}); // file contains {fileID: docName} pairs
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

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
                    const fileParts = file.path.split('/');
                    const fileType = fileParts.at(-1).split('.').at(-1);
                    const fileID = fileParts.at(-1).slice(0, -4); // Extract fileID

                    if (fileType === 'pdf') {
                        try {
                            const metadataResult = await getProperties({
                                path: file.path, // Use the file path to get metadata
                            });

                            const docName =
                                metadataResult.metadata &&
                                metadataResult.metadata.name
                                    ? metadataResult.metadata.name
                                    : 'Document'; // Default name if no metadata found

                            fileData[fileID] = docName; // Store fileID -> metadata name
                        } catch (error) {
                            console.error('Error fetching metadata:', error);
                            fileData[fileID] = 'Document'; // Fallback to default name
                        }
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
        return (
            <div className="bg-white p-6 rounded-lg text-lg font-bold text-sky-900">
                Loading files...
            </div>
        );
    }

    return (
        <div className="mt-3 mb-6 bg-white p-6 rounded-lg bg-opacity-50 overflow-y-auto">
            {Object.keys(files).length === 0 ? (
                <p className="text-lg font-bold text-sky-900">
                    No files found.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(files).map(([fileId, fileName], idx) => (
                        <div
                            key={fileId}
                            className="cursor-pointer bg-sky-100 shadow-lg rounded-lg px-4 pt-40 transition transform hover:scale-102 hover:shadow-xl"
                            aria-label={`file-navigate-${idx}`}
                            onClick={() => navigate(`/file/${fileId}`)}
                        >
                            <img
                                src={`https://placehold.co/600x400/ECECEC/CACACA?text=placeholder`}
                                alt={fileName}
                                className="absolute top-0 left-0 w-full h-40 object-cover rounded-t-lg"
                            />
                            <div className="flex flex-row py-2 content-center">
                                <p className="text-lg font-bold text-sky-900">
                                    {fileName}
                                </p>
                                <button
                                    className="ml-auto hover:text-red-500 hover:cursor-pointer"
                                    onClick={(event) => {
                                        event.stopPropagation(); // Prevent card click event
                                        setSelectedFile({
                                            fileId,
                                            fileName,
                                            folder,
                                        });
                                        setIsDeleteModalOpen(true);
                                    }}
                                    aria-label={`file-delete-button-${idx}`}
                                >
                                    <FaTrashAlt size="20" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FileList;