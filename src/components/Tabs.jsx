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
                    className={`select-none rounded-t-md border-solid border-2 hover:bg-sky-200 border-sky-500 p-2 truncate ${
                        activeTab === num
                            ? 'border-b-white border-b-2 translate-y-[2px] bg-sky-100'
                            : 'bg-white'
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
