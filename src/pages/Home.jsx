import React, { useState, useEffect } from 'react';
import { MdClose } from "react-icons/md";
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { fetchUserAttributes } from 'aws-amplify/auth';
import GoogleSignOut from '../components/GoogleSignOut';

function LoginNavbar() {
    const [userAttributes, setUserAttributes] = useState(null);

    useEffect(() => {
        async function getUserInfo() {
            try {
                const attributes = await fetchUserAttributes();
                // email, name, family_name, given_name, sub, email_verified
                // console.log("Fetched Attributes:", attributes);
                setUserAttributes(attributes);
            } catch (error) {
                console.error("Error fetching user attributes:", error);
            }
        }
        getUserInfo();
    }, []);

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
                    path="unannotated/"
                    maxFileCount={1}
                    isResumable={true}
                    autoUpload={false}
                />
            </div>
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
            </div>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}

export default Home
