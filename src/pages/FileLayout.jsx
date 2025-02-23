import { useState, useEffect } from 'react';
import {Outlet, useNavigate, useLocation, useParams } from "react-router";
import { MdArrowBack } from "react-icons/md";
import { getUrl } from 'aws-amplify/storage';

import Tabs from "../components/Tabs"

function FileLayout(props) {


      //console.log('signed URL: ', linkToStorageFile.url);
      //console.log('URL expires at: ', linkToStorageFile.expiresAt);

  const tab = ["blueprint", "table", "metrics"]
  const navigate = useNavigate();
  const [pdfURL, setPdfURL] = useState(null)

  const { id } = useParams();
  let valid = id === "123";

  const change = (num) => {
    navigate(`/file/${id}/${tab[num]}`);
  }

  const back = () => {
    navigate('/');
  }

  const location = useLocation();
  const { hash, pathname, search } = location;

   useEffect(() => {
      if(valid && (pathname === ("/file/" + id) || pathname === ("/file/" + id + "/"))){
          navigate(`/file/${id}/${tab[0]}`);
        }
    }, []);

    useEffect(() => {
          const getFileFromAWS = async () => {
              const linkToStorageFile = await getUrl({
                          path: "annotated/sarasota_areas_annotated.pdf",
                           options: {
                                bucket: 'raccoonTeamDrive',
                                validateObjectExistence: true,
                                // url expiration time in seconds.
                                expiresIn: 900,
                                // whether to use accelerate endpoint
                                //useAccelerateEndpoint: true,
                          }
                          // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
                        });
              // console.log(linkToStorageFile);
              setPdfURL(linkToStorageFile.url.toString());
          }
          getFileFromAWS();
    }, []);

  const getFileName = (url) => {
      if(!url)
        return ""
    let spl = pdfURL.split("/");
    spl = spl[spl.length - 1].split("?")[0];
    return spl.slice(0, -4);
  }

  return (
    <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between px-3 pt-3">
{/*          flex-col sm:flex-row */}
            <div className="flex">
                <MdArrowBack onClick={back} size='40' className="align-self-center" aria-label="back" />
                {valid ? <span className="text-2xl mx-2 my-auto">{getFileName(pdfURL)}</span> : <></>}
            </div>
            {valid? <Tabs onChange={change} tabs={tab} className="w-1/4" /> : <></>}
{/*             w-3/4 sm:w-1/2 xl:w-1/4 but causes full screen refresh so pdf refreshes too */}
        </div>
        {valid ? "" : "Error. select a valid file to use this."}
        <Outlet context={pdfURL} />
    </div>
  )
}

export default FileLayout