import { useState } from 'react';
import PDFViewer from "../components/PDFViewer"
import { useOutletContext } from 'react-router'

function BPView() {

    const pdfURL = useOutletContext();

    return (
        <div className="select-none rounded-md border-solid border-2 border-sky-500 mx-2 mb-2 p-2 bg-white grow relative">
            <PDFViewer pdfURL={pdfURL} />
        </div>
    )
}

export default BPView