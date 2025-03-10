
function BPViewControlPanel({ pdfURL }) {
    return (
        <div className="shadow-lg rounded-md border-2 border-slate-400 flex flex-col h-full w-[300px]">
            <a
                href={pdfURL}
                target="_blank"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Download File
            </a>
            
        </div>
    );
}

export default BPViewControlPanel;
