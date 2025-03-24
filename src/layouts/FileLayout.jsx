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
    const t = tabs.findIndex((e) => e === page);
    const [activeTab, setActiveTab] = useState(t === -1 ? 0 : t);
    //console.log(activeTab)
    const navigate = useNavigate();
    const [pdfInfo, setPdfInfo] = useState({
        path: {
            annotated: { pdf: null, csv: null },
            unannotated: { pdf: null },
        },
        url: {
            annotated: { pdf: null, csv: null },
            unannotated: { pdf: null },
        },
    });
    const [valid, setValid] = useState(null);
    const userAttributes = useUser();

    const { id } = useParams();
    useEffect(() => {
        if (!userAttributes) return;

        const getFileFromAWS = async () => {
            let pdf = {
                path: {
                    annotated: { pdf: null, csv: null },
                    unannotated: { pdf: null },
                },
                url: {
                    annotated: { pdf: null, csv: null },
                    unannotated: { pdf: null },
                },
            };
            let linkToStorageFile = null;
            pdf.path.annotated.pdf = `annotated/${userAttributes.sub}/${id}.pdf`;
            pdf.path.annotated.csv = `annotated/${userAttributes.sub}/${id}.csv`;
            pdf.path.unannotated.pdf = `unannotated/${userAttributes.sub}/${id}.pdf`;

            try {
                linkToStorageFile = await getUrl({
                    path: pdf.path.annotated.pdf,
                    options: {
                        bucket: 'raccoonTeamDrive',
                        validateObjectExistence: true,
                        // url expiration time in seconds.
                        expiresIn: 900,
                    },
                });
                pdf.url.annotated.pdf = linkToStorageFile.url.toString();
            } catch (error) {}

            try {
                linkToStorageFile = await getUrl({
                    path: pdf.path.unannotated.pdf,
                    options: {
                        bucket: 'raccoonTeamDrive',
                        validateObjectExistence: true,
                        // url expiration time in seconds.
                        expiresIn: 900,
                    },
                });
                pdf.url.unannotated.pdf = linkToStorageFile.url.toString();
                if (pdf.url.unannotated.pdf) setValid(true);
                pdf.name = 'Document';
            } catch (error) {
                setValid(false);
            }

            try {
                linkToStorageFile = await getUrl({
                    path: pdf.path.annotated.csv,
                    options: {
                        bucket: 'raccoonTeamDrive',
                        validateObjectExistence: true,
                        // url expiration time in seconds.
                        expiresIn: 900,
                    },
                });
                pdf.url.annotated.csv = linkToStorageFile.url.toString();
            } catch (error) {}

            try {
                const result = await getProperties({
                    path: `unannotated/${userAttributes.sub}/${id}.pdf`,
                });
                if (result.metadata && result.metadata.name)
                    pdf.name = result.metadata.name;
            } catch (error) {}

            setPdfInfo(pdf);
        };

        getFileFromAWS();
    }, [userAttributes, id]);

    const change = (num) => {
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
        <div className="flex flex-col h-full min-h-fit">
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
                        {pdfInfo.name}
                    </span>
                </div>
                <Tabs
                    onChange={change}
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    className="w-1/4"
                />
            </div>
            <Outlet context={pdfInfo} />
        </div>
    );
}

export default FileLayout;
