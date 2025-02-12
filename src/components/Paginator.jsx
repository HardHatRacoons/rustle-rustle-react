import { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

function Paginator({currPage, maxPages, onChange}) {
    const [page, setPage] = useState(currPage);

    const goToNextPage = () => {
        if (page < maxPages) {
          setPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (page > 1) {
          setPage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        try{
            const i = parseInt(page);
            if(!isNaN(i))
                onChange(i);
        } catch{

        }

    },[page])

    return (
        <div className="flex place-items-center h-fit">
            <button onClick={goToPreviousPage} className="mx-2 rounded-full"><FaAngleLeft /></button>
            <span className="mr-2">Page</span>
            <input type="text" value={page} onChange={(event) => {setPage(event.target.value)}} className="p-0 m-0 w-6 text-center border-2 rounded-sm"></input>
            <span className="ml-2">{` of ${maxPages ? maxPages : 0}`}</span>
            <button onClick={goToNextPage} className="mx-2 rounded-full"><FaAngleRight /></button>
        </div>
    )
}

export default Paginator