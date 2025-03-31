import { useState } from 'react';

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
                    className={`select-none cursor-pointer rounded-t-md border-solid border-2 hover:bg-sky-200 border-sky-500 dark:border-slate-800 p-2 truncate ${
                        activeTab === num
                            ? 'border-b-white border-b-2 translate-y-[2px] bg-sky-100 dark:border-b-slate-900 dark:bg-slate-900 dark:hover:bg-slate-900'
                            : 'bg-white dark:bg-slate-950 dark:hover:bg-slate-900 border-b-white dark:border-b-slate-950'
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
