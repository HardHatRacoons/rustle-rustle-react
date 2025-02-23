import { useState, useEffect } from 'react';
import {Outlet, useNavigate, useLocation, useParams } from "react-router";
import { MdArrowBack } from "react-icons/md";

import Tabs from "../components/Tabs"

function FileLayout(props) {

  const tab = ["blueprint", "table", "metrics"]
  const navigate = useNavigate();
  const [pdfURL, setPdfURL] = useState("/sarasota_areas_annotated.pdf")

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

  const getFileName = (url) => {
    const spl = pdfURL.split("/");
    return spl[spl.length - 1].slice(0, -4);
  }

  return (
    <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between px-3 pt-3">
{/*          flex-col sm:flex-row */}
            <div className="flex">
                <MdArrowBack onClick={back} size='40' className="align-self-center" />
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