
function BPViewControlPanel({ pdfInfo }) {
    return (
        <div className="shadow-lg rounded-md border-2 border-slate-400 flex flex-col h-full w-[300px]">
            <a
                href={pdfInfo.annotated_url}
                target="_blank"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Download Annotated PDF
            </a>
            <a
                href={pdfInfo.annotated_csv}
                target="_blank"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Download Extracted Data CSV
            </a>
            <a
                href={pdfInfo.unannotated_url}
                target="_blank"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Download Unannotated PDF
            </a>
        </div>
    );
}

export default BPViewControlPanel;
