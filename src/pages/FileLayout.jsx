import { useState, useEffect } from 'react';
import {Outlet, useNavigate, useLocation, useParams } from "react-router";
import { MdArrowBack } from "react-icons/md";

import Tabs from "../components/Tabs"

function FileLayout(props) {

  const tab = ["blueprint", "table", "metrics"]
  const navigate = useNavigate();

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
      if(valid && (pathname === ("/file/" + id))){
          navigate(`/file/${id}/${tab[0]}`);
        }
    }, );

  return (
    <div>
        <div className="flex justify-between px-3 pt-3">
            <div className="flex">
                <MdArrowBack onClick={back} size='40' className="align-self-center" />
                {valid ? <span className="text-2xl mx-2 my-auto">DocumentInfoHere</span> : <></>}
            </div>
            {valid? <Tabs onChange={change} tabs={tab} className="w-1/4" /> : <></>}
        </div>
        {valid ? "" : "Error. select a valid file to use this."}
        <Outlet/>
    </div>
  )
}

export default FileLayout