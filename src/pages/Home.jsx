import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { HiMiniSparkles } from 'react-icons/hi2';
import { IoMdRefreshCircle } from 'react-icons/io';
import { remove } from 'aws-amplify/storage';
import { useNavigate } from 'react-router';
import { useUser } from '../components/UserContext';

import LoginNavbar from '../components/LoginNavbar';
import FileList from '../components/FileList';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import UploadModal from '../components/modals/UploadModal';

function Home() {
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
        <div className="h-full bg-sky-300 flex flex-col">
            <LoginNavbar userAttributes={userAttributes} />

            <div className="bg-sky-200 grow overflow-y-auto">
                <div className="m-6 flex flex-row bg-white p-8 rounded-lg">
                    <h1 className="text-4xl font-bold text-sky-950">
                        {' '}
                        Gallery{' '}
                    </h1>

                    <button
                        className="ml-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer"
                        onClick={() => setIsUploadModalOpen(true)}
                        aria-label="open-upload-button"
                    >
                        Upload
                    </button>
                </div>
                <div className="ml-6 mr-6">
                    <div className="flex flex-row justify-between items-center gap-4">
                        <div className="w-full flex flex-row gap-2 items-center">
                            <p className="font-bold text-sky-900 flex flex-row gap-1 items-center">
                                <FaSearch />
                                Search:
                            </p>

                            <input
                                type="text"
                                placeholder="File name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="p-2 border border-gray-300 rounded w-full bg-white"
                            />
                        </div>
                        <IoMdRefreshCircle
                            className="text-sky-900 hover:cursor-pointer hover:text-sky-700"
                            onClick={() => setRefreshKey((prev) => prev + 1)}
                            size="30"
                            aria-label="refresh-button"
                        />
                    </div>

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
