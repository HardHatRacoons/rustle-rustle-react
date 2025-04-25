import BPViewControlPanel from '../components/BPViewControlPanel';
import PDFViewer from '../components/PDFViewer';
import { useOutletContext } from 'react-router';

function BPView() {
    const { pdfInfo, pageNum, setPageNum } = useOutletContext();
    const pdfURL = pdfInfo.url.annotated.pdf || pdfInfo.url.unannotated.pdf;
    return (
        <div className="select-none rounded-xl border-solid border-2 border-sky-100 mb-6 p-4 bg-white dark:bg-slate-900 dark:border-slate-800 grow relative flex flex-row">
            <PDFViewer
                pdfURL={pdfURL}
                pageNum={pageNum}
                setPageNum={setPageNum}
            />
            <BPViewControlPanel pdfInfo={pdfInfo} />
        </div>
    );
}

export default BPView;
