import { useState } from 'react';
import { LuDownload } from 'react-icons/lu';
import { BsFiletypePdf, BsFiletypeCsv } from 'react-icons/bs';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ImSpinner2 } from 'react-icons/im';

/*
 * A collapsible control panel for blueprint view downloads.
 *
 * This component provides download links for various PDF and CSV files related to a blueprint:
 * - Annotated PDF
 * - Annotated CSV (data)
 * - Original unannotated PDF
 *
 * On mobile, the panel is hidden by default and can be toggled via a button. On larger screens,
 * the panel is always visible.
 *
 * If the annotated PDF is not yet available, a spinner with a processing message is shown.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.pdfInfo - Contains URL paths to various versions of the uploaded blueprint.
 * @param {Object} props.pdfInfo.url - An object containing downloadable file URLs.
 * @param {Object} props.pdfInfo.url.annotated - Annotated versions of the file.
 * @param {string} props.pdfInfo.url.annotated.pdf - URL to the annotated PDF version.
 * @param {string} props.pdfInfo.url.annotated.csv - URL to the associated CSV data.
 * @param {string} props.pdfInfo.url.unannotated.pdf - URL to the original unannotated PDF.
 *
 * @returns {React.ReactElement} A control panel with file download buttons and dynamic rendering based on availability.
 *
 * @example
 * <BPViewControlPanel pdfInfo={pdfInfo} />
 */
function BPViewControlPanel({ pdfInfo }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Toggle Button (Fixed to Right Side on Mobile) */}
            <button
                className="md:hidden fixed top-20 right-2 z-50 bg-sky-600 dark:bg-purple-900 text-white p-2 rounded-full shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <IoIosArrowForward /> : <IoIosArrowBack />}
            </button>

            {/* Control Panel */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-72 z-40 transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    md:relative md:translate-x-0 md:w-[300px] md:block
                    shadow-lg rounded-md border-2 border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex flex-col
                `}
            >
                <p className="text-lg text-sky-900 dark:text-slate-300">
                    Downloads:
                </p>
                <div className="grid grid-cols-2 gap-4 p-4 max-w-sm">
                    <a
                        href={pdfInfo.url.annotated.pdf}
                        target="_blank"
                        className={`border-2 border-slate-400 rounded-md p-4 flex flex-col items-center justify-center col-span-2 
                            ${!pdfInfo.url.annotated.pdf ? 'cursor-not-allowed bg-gray-300 dark:bg-slate-500 text-gray-500 dark:text-slate-400' : 'text-sky-900 dark:text-slate-300 bg-sky-300 dark:bg-sky-800 hover:bg-sky-400 dark:hover:bg-sky-700'}`}
                    >
                        <LuDownload className="text-3xl mb-1" />
                        <span>Annotations</span>
                    </a>
                    <a
                        href={pdfInfo.url.annotated.csv}
                        target="_blank"
                        className={`border-2 border-slate-400 rounded-md p-4 flex flex-col items-center justify-center 
                            ${!pdfInfo.url.annotated.csv ? 'cursor-not-allowed bg-gray-200 dark:bg-slate-500 text-gray-500 dark:text-slate-400' : 'text-sky-900 dark:text-slate-300 bg-green-200 dark:bg-green-700 hover:bg-green-30 dark:hover:bg-green-600 text-gray-700'}`}
                    >
                        <BsFiletypeCsv className="text-3xl mb-1" />
                        <span>Data</span>
                    </a>
                    <a
                        href={pdfInfo.url.unannotated.pdf}
                        target="_blank"
                        className="border-2 border-slate-400 text-sky-900 dark:text-slate-300 rounded-md p-4 flex flex-col items-center justify-center 
                            hover:bg-slate-200 dark:hover:bg-slate-700 dark:bg-slate-800"
                    >
                        <BsFiletypePdf className="text-3xl mb-1" />
                        <span>Original</span>
                    </a>
                </div>
                {!pdfInfo.url.annotated.pdf && (
                    <p className="text-lg text-sky-900 dark:text-slate-300 inline-flex">
                        <ImSpinner2 className="text-3xl mx-3 animate-spin" />
                        <span>Blueprint currently processing</span>
                    </p>
                )}
            </div>
        </div>
    );
}

export default BPViewControlPanel;
