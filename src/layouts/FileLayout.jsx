import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router';
import { MdArrowBack } from 'react-icons/md';
import { getUrl, getProperties } from 'aws-amplify/storage';
import { useUser } from '../components/UserContext';

import Tabs from '../components/Tabs';

function FileLayout() {
    const tabs = ['blueprint', 'table', 'metrics'];

    const location = useLocation();
    const { hash, pathname, search } = location;

    const page = pathname.split('/').at(-1);
    const [activeTab, setActiveTab] = useState(
        tabs.findIndex((e) => e === page),
    );
    const navigate = useNavigate();
    const [pdfURL, setPdfURL] = useState(null);
    const userAttributes = useUser();

    const { id } = useParams();

    const [docName, setDocName] = useState(null);

    useEffect(() => {
        if (!userAttributes) return;

        const getFileFromAWS = async () => {
            const linkToStorageFile = await getUrl({
                path: `annotated/${userAttributes.sub}/${id}.pdf`,
                options: {
                    bucket: 'raccoonTeamDrive',
                    validateObjectExistence: true,
                    // url expiration time in seconds.
                    expiresIn: 900,
                    // whether to use accelerate endpoint
                    // useAccelerateEndpoint: true,
                },
                // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
            });
            // console.log(linkToStorageFile);
            setPdfURL(linkToStorageFile.url.toString());

            try {
                const result = await getProperties({
                    path: `annotated/${userAttributes.sub}/${id}.pdf`,
                });
                // console.log(result);
                if (result.metadata && result.metadata.name) {
                    setDocName(result.metadata.name);
                } else {
                    setDocName('Document');
                }
            } catch (error) {
                console.log('Error ', error);
            }
        };
        getFileFromAWS();
    }, [userAttributes]);

    let valid = pdfURL !== null;

    const change = (num) => {
        setActiveTab(num);
        navigate(`/file/${id}/${tabs[num]}`);
    };

    useEffect(() => {
        if (
            valid &&
            (pathname === '/file/' + id || pathname === '/file/' + id + '/')
        )
            navigate(`/file/${id}/${tabs[0]}`);
    }, [valid]);

    if (!valid)
        return (
            <div className="flex flex-col h-full">
                <div className="flex flex-row justify-between px-3 pt-3">
                    <MdArrowBack
                        onClick={() => {
                            navigate('/');
                        }}
                        size="40"
                        className="align-self-center cursor-pointer"
                        aria-label="back"
                    />
                </div>
                <div>Loading...</div>
            </div>
        );

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-row justify-between px-3 pt-3">
                <div className="flex">
                    <MdArrowBack
                        onClick={() => {
                            navigate('/');
                        }}
                        size="40"
                        className="align-self-center"
                        aria-label="back"
                    />
                    <span className="text-2xl mx-2 my-auto">{docName}</span>
                </div>
                <Tabs
                    onChange={change}
                    tabs={tabs}
                    activeTab={activeTab}
                    className="w-1/4"
                />
            </div>
            <Outlet context={pdfURL} />
        </div>
    );
}

export default FileLayout;
