import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router';
import { MdArrowBack } from 'react-icons/md';
import { getUrl } from 'aws-amplify/storage';

import Tabs from '../components/Tabs';

function FileLayout(props) {
    const tabs = ['blueprint', 'table', 'metrics'];

    const location = useLocation();
    const { hash, pathname, search } = location;

    const page = pathname.split('/').at(-1);
    const [activeTab, setActiveTab] = useState(
        tabs.findIndex((e) => e === page),
    );
    const navigate = useNavigate();
    const [pdfURL, setPdfURL] = useState(null);

    const { id } = useParams();
    let valid = id === '123';

    const change = (num) => {
        setActiveTab(num);
        navigate(`/file/${id}/${tabs[num]}`);
    };

    const back = () => {
        navigate('/');
    };

    useEffect(() => {
        if (
            valid &&
            (pathname === '/file/' + id || pathname === '/file/' + id + '/')
        ) {
            navigate(`/file/${id}/${tabs[0]}`);
        }
    }, []);

    useEffect(() => {
        const getFileFromAWS = async () => {
            const linkToStorageFile = await getUrl({
                path: 'annotated/sarasota_areas_annotated.pdf',
                options: {
                    bucket: 'raccoonTeamDrive',
                    validateObjectExistence: true,
                    // url expiration time in seconds.
                    expiresIn: 900,
                    // whether to use accelerate endpoint
                    //useAccelerateEndpoint: true,
                },
                // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
            });
            // console.log(linkToStorageFile);
            setPdfURL(linkToStorageFile.url.toString());
        };
        getFileFromAWS();
    }, []);

    const getFileName = (url) => {
        if (!url) return '';
        let spl = pdfURL.split('/');
        spl = spl[spl.length - 1].split('?')[0];
        return spl.slice(0, -4);
    };

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
                <div>Error. select a valid file to use this.</div>
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
                    <span className="text-2xl mx-2 my-auto">
                        {getFileName(pdfURL)}
                    </span>
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
