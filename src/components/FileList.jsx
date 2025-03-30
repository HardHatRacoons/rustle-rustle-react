import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { list, getProperties, getUrl } from 'aws-amplify/storage';
import { useNavigate } from 'react-router';

function FileList({
    userAttributes,
    folder,
    searchQuery,
    setSelectedFile,
    setIsDeleteModalOpen,
}) {
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
                        // initialize fileData for the file if it is not yet initialized
                        if (fileData[fileID] === undefined)
                            fileData[fileID] = {};
                        try {
                            const metadataResult = await getProperties({
                                path: file.path, // Use the file path to get metadata
                            });
                            const docName =
                                metadataResult.metadata &&
                                metadataResult.metadata.name
                                    ? metadataResult.metadata.name
                                    : 'Document'; // Default name if no metadata found

                            fileData[fileID]['name'] = docName; // Store fileID -> metadata name
                        } catch (error) {
                            console.error('Error fetching metadata:', error);
                            fileData[fileID]['name'] = 'Document'; // Fallback to default name
                        }
                    } else if (fileType === 'png') {
                        // initialize fileData for the file if it is not yet initialized
                        if (fileData[fileID] === undefined)
                            fileData[fileID] = {};
                        try {
                            let linkToStorageFile = null;
                            linkToStorageFile = await getUrl({
                                path: file.path,
                                options: {
                                    bucket: 'raccoonTeamDrive',
                                    validateObjectExistence: true,
                                    // url expiration time in seconds.
                                    expiresIn: 20,
                                },
                            });
                            if (linkToStorageFile) {
                                fileData[fileID]['image'] =
                                    linkToStorageFile.url.toString();
                            }
                        } catch (error) {}
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

    const filteredFiles = Object.entries(files).filter(
        ([fileId, file]) =>
            file.name &&
            file.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Show a loading message until both userAttributes and files are fetched
    if (!userAttributes || loading) {
        return (
            <div className="bg-white text-lg font-bold text-sky-900 mt-3 mb-6 p-6 overflow-y-auto">
                Loading files...
            </div>
        );
    }

    return (
        <div className="mt-6 p-6 overflow-y-auto">
            {filteredFiles.length === 0 ? (
                <p className="text-lg font-bold text-sky-900 dark:text-slate-700">
                    No files found.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredFiles.map(([fileId, file], idx) => (
                        <div
                            key={fileId}
                            className="cursor-pointer bg-sky-100 shadow-lg rounded-lg px-4 pt-40 transition transform hover:scale-102"
                            aria-label={`file-navigate-${idx}`}
                            onClick={() => navigate(`/file/${fileId}`)}
                        >
                            <img
                                src={
                                    file.image
                                        ? file.image
                                        : `https://placehold.co/600x400/ECECEC/CACACA?text=Loading`
                                }
                                alt={file.name}
                                className="absolute top-0 left-0 w-full h-40 object-cover rounded-t-lg"
                            />
                            <div className="flex flex-row py-2 content-center w-full">
                                <p className="text-lg font-bold text-sky-900 whitespace-normal break-words">
                                    {file.name.replaceAll('_', '_\u200B')}
                                </p>
                                <button
                                    className="ml-auto hover:text-red-500 hover:cursor-pointer"
                                    onClick={(event) => {
                                        event.stopPropagation(); // Prevent card click event
                                        setSelectedFile({
                                            fileId,
                                            fileName: files[fileId].name,
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
