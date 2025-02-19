import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import * as pdfjs from "pdfjs-dist/build/pdf";

import Paginator from "./Paginator";

function PDFViewer({pdfURL, className}) {
    const containerRef = useRef(null);

    const resizeTimeoutRef = useRef(null); //debounce resizing
    const observerRef = useRef(null);
    const isMounted = useRef(false);

    const [pageNum, setPageNum] = useState(1);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [anno, setAnno] = useState([]);

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

    const calculateCollision = (mouseX, mouseY) => {
        let t = false;
        for (const element of anno) {
           if(element.subtype == "Square"){
                if (
                    mouseX >= element.rect[0] &&
                    mouseX <= element.rect[0] + element.rect[2] &&
                    mouseY >= element.rect[1] &&
                    mouseY <= element.rect[1] + element.rect[3]
                  ){
                    t = true;
                }

           }

         }
         if(t) console.log("inside")
    }

    const renderPDF = async (pageNum) => {
        if(!pdfURL)
            return;
         try {
             const pdf = await pdfjs.getDocument(pdfURL).promise;
             setPdfDocument(pdf)

             const page = await pdf.getPage(pageNum);

             const canvasContainer = containerRef.current;
             canvasContainer.innerHTML = '';

             const canvas = document.createElement('canvas');
             canvasContainer.appendChild(canvas);

             const context = canvas.getContext('2d');
             const scale = calculateScale(page);
             const viewport = page.getViewport({ scale:scale});

             canvas.height = viewport.height;
             canvas.width = viewport.width;

             //annotation processing
             const trackMousePosition = (event) => {
                 const canvasRect = canvas.getBoundingClientRect(); // Get canvas position on the page
                 const mouseX = event.clientX - canvasRect.left; // Calculate mouse X relative to canvas
                 let mouseY = event.clientY - canvasRect.top;  // Calculate mouse Y relative to canvas
                 mouseY = canvasRect.bottom - mouseY; //this logic is wrongn

                 calculateCollision(mouseX / scale, mouseY / scale)
              };
             canvas.addEventListener('mousemove', trackMousePosition);

             page.getAnnotations().then((annotations) => {
                let newAnnos = [];
                 for (const element of annotations) {
                   if(element.annotationType == 5){
                    newAnnos.push(element)
                   }
                 }
                 setAnno(newAnnos)
              });

             await page.render({
                 canvasContext: context,
                 viewport: viewport,
             });
         } catch (error) {
               console.error('Error rendering PDF:', error);
         }
    };

    useEffect(() => {
       renderPDF(pageNum);
    }, [pageNum, pdfURL]);

    useLayoutEffect(() => {
        const resizeHandler = () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = setTimeout(() => {
                if(!isMounted.current){
                    isMounted.current = true;
                } else {
                    renderPDF(pageNum);
                }
            }, 500); // debounce
        };

        if (observerRef.current) {
            // Disconnect the old observer first
            observerRef.current.disconnect();
        }

        const resizeObserver = new ResizeObserver(resizeHandler);
        observerRef.current = resizeObserver;

        resizeObserver.observe(document.body);

        // Clean up the observer when the component is unmounted
        return () => {
            resizeObserver.disconnect();
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
        <div className={`flex flex-col h-full w-8/10 ${className? className : ""}`}>
{/*          w-8/10*/}
            <div ref={containerRef} className="grow w-full"></div>
            <Paginator currPage={pageNum} maxPages={pdfDocument?.numPages} onChange={setPageNum}/>
        </div>
    )
}

export default PDFViewer