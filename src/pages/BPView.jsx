import BPViewControlPanel from '../components/BPViewControlPanel';
import PDFViewer from '../components/PDFViewer';
import { useOutletContext } from 'react-router';

function BPView() {
    const pdfInfo = useOutletContext();
    const pdfURL = pdfInfo.annotated_url
        ? pdfInfo.annotated_url
        : pdfInfo.unannotated_url;
    return (
        <div className="select-none rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 bg-white grow relative flex flex-row">
            <PDFViewer pdfURL={pdfURL} />
            <BPViewControlPanel pdfInfo={pdfInfo} />
        </div>
    );
}

export default BPView;
