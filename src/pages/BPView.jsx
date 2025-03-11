import BPViewControlPanel from '../components/BPViewControlPanel';
import PDFViewer from '../components/PDFViewer';
import { useOutletContext } from 'react-router';

function BPView() {
    const pdfInfo = useOutletContext();

    return (
        <div className="select-none rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 bg-white grow relative flex flex-row">
            <PDFViewer pdfURL={pdfInfo.annotated_url} />
            <BPViewControlPanel pdfInfo={pdfInfo} />
        </div>
    );
}

export default BPView;
