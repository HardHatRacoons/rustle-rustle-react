import { useState } from 'react';

/*
 * Renders tabs with the given tab titles.
 *
 * @component
 * @param {Object} props
 * @param {number} props.onChange The .
 * @param {number} props.pageNum The page number to be displayed intially.
 * @param {(i: number) => void} props.setPageNum The setter function to change the page number.
 * @returns rendered pdf.
 */
function Tabs({ onChange, tabs, activeTab, setActiveTab, className }) {
    const longestWord = tabs?.reduce(
        (savedText, text) =>
            text.length > savedText.length ? text : savedText,
        '',
    );

    const change = (num) => {
        setActiveTab(num);
        onChange(num);
    };

    return (
        <div
            className={`grid grid-rows-1 grid-flow-col auto-cols-fr gap-2 mx-2 z-10 ${
                className ? className : ''
            }`}
        >
            {tabs?.map((tab, num) => (
                <div
                    key={num}
                    className={`mt-4 select-none cursor-pointer rounded-t-lg border-solid border-x-2 border-t-2 border-sky-100 dark:border-slate-800 p-2 truncate ${
                        activeTab === num
                            ? 'translate-y-[2px] bg-white hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-900'
                            : 'bg-sky-100 dark:bg-slate-950 hover:bg-sky-50 dark:hover:bg-slate-900'
                    }`}
                    onClick={() => change(num)}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
            ))}
        </div>
    );
}

export default Tabs;
