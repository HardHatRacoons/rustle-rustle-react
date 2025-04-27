import { useState } from 'react';

/*
 * Renders tabs with the given tab titles.
 *
 * @component
 * @param {Object} props
 * @param {(i: number) => void} props.onChange The function to call when a tab is clicked.
 * @param {Array} props.tabs Tab titles to render.
 * @param {number} props.activeTab current active tab.
 * @param {(i: number) => void} props.setActiveTab function to change active tab.
 * @param {String} props.className classNames to add to the tabs for styling.
 * @returns {React.ReactElement} the rendered tabs.
 */
function Tabs({ onChange, tabs, activeTab, setActiveTab, className }) {
    //calculate the longest word to make tab sizing consistent
    const longestWord = tabs?.reduce(
        (savedText, text) =>
            text.length > savedText.length ? text : savedText,
        '',
    );

    /*
     * The callback for a tab click event.
     *
     * @function
     */
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
