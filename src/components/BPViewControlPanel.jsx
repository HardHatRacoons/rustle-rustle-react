import { LuDownload } from 'react-icons/lu';
import { BsFiletypePdf, BsFiletypeCsv } from 'react-icons/bs';

function BPViewControlPanel({ pdfInfo }) {
    return (
        <div className="shadow-lg rounded-md border-2 border-slate-400 flex flex-col h-full w-[300px] p-4">
            <p className="text-lg text-sky-900">Downloads:</p>
            <div className="grid grid-cols-2 gap-4 p-4 max-w-sm">
                <a
                    href={pdfInfo.annotated_url}
                    target="_blank"
                    className="border-2 border-slate-400 rounded-md p-4 flex flex-col items-center justify-center bg-sky-300 hover:bg-sky-400 col-span-2"
                >
                    <LuDownload className="text-3xl mb-1" />
                    <span>Annotations</span>
                </a>
                <a
                    href={pdfInfo.annotated_csv}
                    target="_blank"
                    className="border-2 border-slate-400 bg-green-200 text-gray-700 rounded-md p-4 flex flex-col items-center justify-center hover:bg-green-300"
                >
                    <BsFiletypeCsv className="text-3xl mb-1" />
                    <span>Data</span>
                </a>
                <a
                    href={pdfInfo.unannotated_url}
                    target="_blank"
                    className="border-2 border-slate-400 text-gray-700 rounded-md p-4 flex flex-col items-center justify-center hover:bg-slate-200"
                >
                    <BsFiletypePdf className="text-3xl mb-1" />
                    <span>Original</span>
                </a>
            </div>
        </div>
    );
}

export default BPViewControlPanel;
