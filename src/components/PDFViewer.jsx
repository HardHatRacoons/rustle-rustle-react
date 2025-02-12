import { useState, useRef, useEffect } from 'react';

import * as pdfjs from "pdfjs-dist/build/pdf";

import Paginator from "./Paginator";

function PDFViewer({pdfURL, className}) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [pageNum, setPageNum] = useState(1);
    const [pdfDocument, setPdfDocument] = useState(null);
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                                            'pdfjs-dist/build/pdf.worker.min.mjs',
                                            import.meta.url
                                          ).toString()
    const currRender = useRef(false);
    const currPage = useRef(pageNum);

    const calculateScale = (page) => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const containerHeight = containerRef.current.offsetHeight;

          const viewport = page.getViewport({ scale: 1 });
          const isLandscape = viewport.width > viewport.height;

          let scaleWidth = containerWidth / viewport.width;
          let scaleHeight = containerHeight / viewport.height;

          return Math.min(scaleWidth, scaleHeight);
        }
        return 1; // default
      };

    const renderPDF = async () => {
        if (currRender.current) {
            //currPage.current = pageNum;
            return;
         }
         currRender.current = true;
         try {
             const pdf = await pdfjs.getDocument(pdfURL).promise;
             setPdfDocument(pdf)
             const page = await pdf.getPage(pageNum);

             const canvas = canvasRef.current;
             const context = canvas.getContext('2d');
             const viewport = page.getViewport({ scale:calculateScale(page)});

             canvas.height = viewport.height;
             canvas.width = viewport.width;

             await page.render({
                 canvasContext: context,
                 viewport: viewport,
             });
         } catch (error) {
           console.error('Error rendering PDF:', error);
         } finally {
                 // Mark render as complete (no longer in progress)
                 currRender.current = false;

//                  if (currPage.current !== pageNum) {
//                    renderPDF(); // Trigger the render for the new pageNum
//                  }
         }
    };

    useEffect(() => {
       renderPDF();
    }, [pageNum]);

//      doesnt work bc needs mutex
//     useEffect(() => {
//         const resizeObserver = new ResizeObserver(() => {
//           renderPDF();
//         });
//
//         if (containerRef.current) {
//           resizeObserver.observe(containerRef.current);
//         }
//
//         // Clean up the observer when the component is unmounted
//         return () => {
//           if (containerRef.current) {
//             resizeObserver.disconnect();
//           }
//         };
//       }, []);

    const goToNextPage = () => {
        if (pageNum < pdfDocument.numPages) {
          setPageNum((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (pageNum > 1) {
          setPageNum((prev) => prev - 1);
        }
    };

    return (
        <div className={`flex flex-col h-full w-8/10 md:w-full ${className? className : ""}`}>
            <div ref={containerRef} className="grow w-full">
                <canvas ref={canvasRef} />
            </div>
            <Paginator currPage={pageNum} maxPages={pdfDocument?.numPages} onChange={setPageNum}/>
        </div>
    )
}

export default PDFViewer