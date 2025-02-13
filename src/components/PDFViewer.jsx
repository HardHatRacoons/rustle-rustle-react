import { useState, useRef, useEffect } from 'react';

import * as pdfjs from "pdfjs-dist/build/pdf";

import Paginator from "./Paginator";

function PDFViewer({pdfURL, className}) {
    const containerRef = useRef(null);
    const resizeTimeoutRef = useRef(null); //debounce resizing
    const observerRef = useRef(null);
    const [pageNum, setPageNum] = useState(1);
    const [pdfDocument, setPdfDocument] = useState(null);
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                                            'pdfjs-dist/build/pdf.worker.min.mjs',
                                            import.meta.url
                                          ).toString()

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

    const renderPDF = async (pageNum) => {
         try {
             const pdf = await pdfjs.getDocument(pdfURL).promise;
             setPdfDocument(pdf)
             const page = await pdf.getPage(pageNum);

             const canvasContainer = containerRef.current;
             canvasContainer.innerHTML = '';
             const canvas = document.createElement('canvas');
             canvasContainer.appendChild(canvas);

             const context = canvas.getContext('2d');
             const viewport = page.getViewport({ scale:calculateScale(page)});

             canvas.height = viewport.height;
             canvas.width = viewport.width;

             await page.render({
                 canvasContext: context,
                 viewport: viewport,
             });
         } catch (error) {
            if (error.name === 'AbortError') {
               console.log('Rendering operation aborted');
            } else {
               console.error('Error rendering PDF:', error);
            }
         }
    };

    useEffect(() => {
       renderPDF(pageNum);
    }, [pageNum]);

    useEffect(() => {
        const resizeHandler = () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = setTimeout(() => {
                renderPDF(pageNum);
            }, 200); // Wait for 200ms after resizing stops
        };

        if (observerRef.current) {
            // Disconnect the old observer first
            observerRef.current.disconnect();
        }

        const resizeObserver = new ResizeObserver(resizeHandler);
        observerRef.current = resizeObserver;

        if (containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }

        // Clean up the observer when the component is unmounted
        return () => {
          if (containerRef.current) {
            resizeObserver.disconnect();
          }
        };
      }, []);

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
        <div className={`flex flex-col h-full sm:w-8/10 w-full ${className? className : ""}`}>
            <div ref={containerRef} className="grow w-full"></div>
            <Paginator currPage={pageNum} maxPages={pdfDocument?.numPages} onChange={setPageNum}/>
        </div>
    )
}

export default PDFViewer