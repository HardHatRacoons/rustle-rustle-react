import { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

function Paginator({ currPage, maxPages, onChange }) {
    const [page, setPage] = useState(currPage);

    const goToNextPage = () => {
        const p = parseInt(page);
        if (!isNaN(p) && p < maxPages) setPage(p + 1);
    };

    const goToPreviousPage = () => {
        const p = parseInt(page);
        if (!isNaN(p) && p > 1) setPage(p - 1);
    };

    useEffect(() => {
        const i = parseInt(page);
        if (!isNaN(i) && i >= 1 && i <= maxPages) onChange(i);
    }, [page]);

    return (
        <div className="flex place-items-center text-sky-900 dark:text-slate-300">
            <button
                onClick={goToPreviousPage}
                className="mx-2 rounded-full cursor-pointer"
                aria-label="previous-page"
            >
                <FaAngleLeft />
            </button>
            <span className="mr-2">Page</span>
            <input
                type="text"
                aria-label="page-number"
                value={page}
                onChange={(event) => {
                    setPage(event.target.value);
                }}
                className="p-0 m-0 w-8 text-center border-2 rounded-sm"
            ></input>
            <span className="ml-2">{` of ${maxPages ? maxPages : 0}`}</span>
            <button
                onClick={goToNextPage}
                className="mx-2 rounded-full cursor-pointer"
                aria-label="next-page"
            >
                <FaAngleRight />
            </button>
        </div>
    );
}

export default Paginator;
