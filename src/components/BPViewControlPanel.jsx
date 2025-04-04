import { LuDownload } from 'react-icons/lu';
import { BsFiletypePdf, BsFiletypeCsv } from 'react-icons/bs';

function BPViewControlPanel({ pdfInfo }) {
    return (
        <div className="shadow-lg rounded-md border-2 border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col h-full w-[300px] p-4">
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
                <p className="text-lg text-sky-900 dark:text-slate-300">
                    Blueprint currently processing
                </p>
            )}
        </div>
    );
}

export default BPViewControlPanel;
