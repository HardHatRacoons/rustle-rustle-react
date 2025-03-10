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
    const [pdfInfo, setPdfInfo] = useState(null);
    const [valid, setValid] = useState(null);
    const userAttributes = useUser();

    const { id } = useParams();
    useEffect(() => {
        if (!userAttributes) return;

        const getFileFromAWS = async () => {
            let pdf = {};
            let linkToStorageFile = null;
            try {
                linkToStorageFile = await getUrl({
                    path: `annotated/${userAttributes.sub}/${id}.pdf`,
                    options: {
                        bucket: 'raccoonTeamDrive',
                        validateObjectExistence: true,
                        // url expiration time in seconds.
                        expiresIn: 900,
                    },
                });
            } catch (error) {
                setValid(false);
                return;
            }
            pdf.annotated_url = linkToStorageFile.url.toString();
            if (pdf.annotated_url)
                setValid(true);

            try {
                linkToStorageFile = await getUrl({
                    path: `unannotated/${userAttributes.sub}/${id}.pdf`,
                    options: {
                        bucket: 'raccoonTeamDrive',
                        validateObjectExistence: true,
                        // url expiration time in seconds.
                        expiresIn: 900,
                    },
                });
                pdf.unannotated_url = linkToStorageFile.url.toString();
            } catch (error) {
            }

            try {
                linkToStorageFile = await getUrl({
                    path: `annotated/${userAttributes.sub}/${id}.csv`,
                    options: {
                        bucket: 'raccoonTeamDrive',
                        validateObjectExistence: true,
                        // url expiration time in seconds.
                        expiresIn: 900,
                    },
                });
                pdf.annotated_csv = linkToStorageFile.url.toString();
            } catch (error) {
            }

            try {
                const result = await getProperties({
                    path: `annotated/${userAttributes.sub}/${id}.pdf`,
                });
                if (result.metadata && result.metadata.name) {
                    pdf.name = result.metadata.name;
                } else {
                    pdf.name = 'Document';
                }
            } catch (error) {
                console.log('Error ', error);
            }
            setPdfInfo(pdf);
        };
        getFileFromAWS();
    }, [userAttributes]);
    console.log(pdfInfo);
    console.log(valid);
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

    if (!valid || !pdfInfo)
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
                <div>
                    {valid === null
                        ? 'Loading...'
                        : 'Error. Invalid file specified.'}
                </div>
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
                    <span className="text-2xl mx-2 my-auto">{pdfInfo.name}</span>
                </div>
                <Tabs
                    onChange={change}
                    tabs={tabs}
                    activeTab={activeTab}
                    className="w-1/4"
                />
            </div>
            <Outlet context={pdfInfo} />
        </div>
    );
}

export default FileLayout;
