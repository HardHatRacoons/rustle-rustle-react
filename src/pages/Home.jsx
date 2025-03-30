import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { HiMiniSparkles } from 'react-icons/hi2';
import { IoMdRefreshCircle } from 'react-icons/io';
import { remove } from 'aws-amplify/storage';
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router';

import { useUser } from '../components/UserContext';
import LoginNavbar from '../components/LoginNavbar';
import FileList from '../components/FileList';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import UploadModal from '../components/modals/UploadModal';

function Home() {
    const themeController = useOutletContext();

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Single state for refreshing
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const userAttributes = useUser();

    const handleCloseUploadModal = () => {
        setIsUploadModalOpen(false);
        setRefreshKey((prev) => prev + 1); // Incrementing key triggers re-render
    };

    const handleDeleteFile = async () => {
        // Construct the file path
        const paths = [
            `unannotated/${userAttributes.sub}/${selectedFile.fileId}.png`,
            `unannotated/${userAttributes.sub}/${selectedFile.fileId}.pdf`,
            `annotated/${userAttributes.sub}/${selectedFile.fileId}.pdf`,
            `annotated/${userAttributes.sub}/${selectedFile.fileId}.csv`,
            `annotated/${userAttributes.sub}/${selectedFile.fileId}.json`,
        ];
        // individually try to remove each file
        paths.forEach(async (path) => {
            try {
                // Call Amplify remove function
                await remove({ path });
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        });

        // trigger refresh
        setRefreshKey((prev) => prev + 1);
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <LoginNavbar
                userAttributes={userAttributes}
                themeController={themeController}
            />

            <div className="px-6 w-full flex flex-row gap-2 items-center">
                <div className="flex flex-row px-2 py-0.5 border-2 border-sky-50 rounded-full w-full bg-sky-50 focus-within:border-sky-900 dark:bg-slate-300 dark:border-slate-300 dark:focus-within:border-white">
                    <p className="font-bold text-sky-900 dark:text-slate-900 flex flex-row gap-1 items-center">
                        <FaSearch />
                        Search:
                    </p>
                    <input
                        type="text"
                        placeholder="File name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 outline-none h-[30px] text-sky-700"
                    />
                </div>
            </div>

            <div className="flex flex-col flex-1">
                <div
                    className="m-6 grow h-full bg-white dark:bg-slate-500 p-8 rounded-xl flex flex-col
                                max-h-[calc(100vh-15em)] xs:max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-10rem)]"
                >
                    <div className="flex flex-wrap items-center mb-6">
                        <h1 className="text-4xl font-bold text-sky-950 dark:text-slate-800">
                            Gallery
                        </h1>

                        <div className="ml-auto flex flex-row gap-2 items-center">
                            <div className="ml-4 flex flex-row justify-between items-center gap-4">
                                <IoMdRefreshCircle
                                    className="text-sky-400 hover:cursor-pointer hover:text-sky-300 dark:hover:text-slate-200 dark:text-slate-300"
                                    onClick={() =>
                                        setRefreshKey((prev) => prev + 1)
                                    }
                                    size="30"
                                    aria-label="refresh-button"
                                />
                            </div>

                            <button
                                className="bg-sky-400 dark:bg-slate-300 text-white dark:text-slate-700 px-6 py-2 rounded-lg hover:bg-sky-300 dark:hover:bg-slate-200 cursor-pointer"
                                onClick={() => setIsUploadModalOpen(true)}
                                aria-label="open-upload-button"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        <FileList
                            userAttributes={userAttributes}
                            key={`unannotated-${refreshKey}`}
                            folder="unannotated"
                            searchQuery={searchQuery}
                            setSelectedFile={setSelectedFile}
                            setIsDeleteModalOpen={setIsDeleteModalOpen}
                        />
                    </div>
                </div>
            </div>

            <UploadModal
                userAttributes={userAttributes}
                isOpen={isUploadModalOpen}
                onClose={() => handleCloseUploadModal()}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteFile}
                fileName={selectedFile?.fileName}
            />
        </div>
    );
}

export default Home;
