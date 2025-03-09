import PDFViewer from '../components/PDFViewer';
import { useOutletContext } from 'react-router';

function BPView() {
    const pdfURL = useOutletContext();

    return (
        <div className="select-none rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 bg-white grow relative flex flex-row">
            <PDFViewer pdfURL={pdfURL} />
            <div className="shadow-lg rounded-md border-2 border-slate-400 flex flex-col h-full w-[300px]">

            </div>
        </div>
    );
}

export default BPView;
