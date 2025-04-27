import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { list, getProperties, getUrl } from 'aws-amplify/storage';
import { useNavigate } from 'react-router';


/*
 * Displays a searchable and interactive list of uploaded files for the current user.
 *
 * Fetches files from AWS Amplify Storage based on the authenticated user's ID and the provided folder.
 * For each file, it displays a card with a thumbnail (first page of the PDF rendered as a PNG),
 * the user-defined name (from metadata), and a delete button. Files can be clicked to navigate to a detailed view.
 *
 * If no matching files are found, a message is shown. File data is cached in localStorage for improved performance.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.userAttributes - AWS Cognito user attributes, used to determine the file path.
 * @param {string} props.folder - The folder name in which to search for files (e.g., 'unannotated').
 * @param {string} props.searchQuery - The current text used to filter the displayed files by name.
 * @param {(file: { fileId: string, fileName: string, folder: string }) => void} props.setSelectedFile - Callback to set the selected file for deletion.
 * @param {(isOpen: boolean) => void} props.setIsDeleteModalOpen - Callback to control visibility of the delete confirmation modal.
 *
 * @returns {React.ReactElement} A responsive grid of file cards, each with an image preview, name, and delete option.
 *
 * @example
 * <FileList
 *   userAttributes={user}
 *   folder="unannotated"
 *   searchQuery={search}
 *   setSelectedFile={setSelectedFile}
 *   setIsDeleteModalOpen={setIsDeleteModalOpen}
 * />
 */
function FileList({
    userAttributes,
    folder,
    searchQuery,
    setSelectedFile,
    setIsDeleteModalOpen,
}) {
    const [files, setFiles] = useState(
        JSON.parse(localStorage.getItem('files')) || {},
    ); // file contains {fileID: docName} pairs

    const navigate = useNavigate();

    useEffect(() => {
        // Wait until userAttributes is available
        if (!userAttributes) return;

        const filepath = `${folder}/${userAttributes.sub}/`;

        /*
        * Fetches files from AWS Amplify Storage and updates the state with file metadata.
        * The function retrieves the file name from metadata and the first page of the PDF as a PNG image.
        * It also caches the file data in localStorage for improved performance.
        * 
        * @function
        * @returns {Promise<void>} A promise that resolves when the file data is fetched and state is updated.
        * @throws {Error} If there is an error while fetching the file list or metadata.      
        * */
        const fetchFiles = async () => {
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
                localStorage.setItem('files', JSON.stringify(fileData));
            } catch (error) {
                console.error('Error listing files:', error);
            }
        };

        fetchFiles();
    }, [userAttributes]); // Ensure effect runs only when userAttributes is available

    /*
    * Filters and sorts the files based on the search query.
    * The filtered files are then sorted alphabetically by their names.
    * @function 
    * @returns {Array} An array of filtered and sorted file entries.
    */
    const filteredFiles = Object.entries(files)
        .filter(
            ([fileId, file]) =>
                file.name &&
                file.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort(([, a], [, b]) => a.name.localeCompare(b.name));

    return (
        <div>
            {filteredFiles.length === 0 ? (
                <p className="text-lg font-bold text-sky-900 dark:text-slate-300">
                    No files found.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredFiles.map(([fileId, file], idx) => (
                        <div
                            key={fileId}
                            className="cursor-pointer bg-sky-100 dark:bg-slate-700 shadow-lg rounded-lg px-4 pt-40 transition transform hover:scale-102 hover:brightness-95 dark:hover:brightness-110"
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
                                className="absolute top-0 left-0 w-full h-40 object-cover rounded-t-lg dark:brightness-80"
                            />
                            <div className="flex flex-row py-2 w-full items-start">
                                <div>
                                    <p className="content-center text-lg font-bold text-sky-900 dark:text-slate-300 whitespace-normal break-words">
                                        {file.name.replaceAll('_', '_\u200B')}
                                    </p>
                                </div>
                                <button
                                    className="ml-auto text-sky-700 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-700 hover:cursor-pointer p-2"
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
                                    <FaTrashAlt size="25" />
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
