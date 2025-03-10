function BPViewControlPanel({ pdfInfo }) {
    return (
        <div className="shadow-lg rounded-md border-2 border-slate-400 flex flex-col h-full w-[300px]">
            <p className="text-lg text-sky-900">Downloads:</p>
            <div className="flex flex-row justify-between mb-1">
                <a
                    href={pdfInfo.annotated_url}
                    target="_blank"
                    className="bg-sky-300 text-white px-4 py-2 rounded hover:bg-sky-400"
                >
                    Annotated PDF
                </a>
                <a
                    href={pdfInfo.annotated_csv}
                    target="_blank"
                    className="bg-sky-300 text-white px-4 py-2 rounded hover:bg-sky-400"
                >
                    Extracted Data
                </a>
            </div>
            <a
                href={pdfInfo.unannotated_url}
                target="_blank"
                className="bg-sky-300 text-white px-4 py-2 rounded hover:bg-sky-400"
            >
                Unannotated PDF
            </a>
        </div>
    );
}

export default BPViewControlPanel;
