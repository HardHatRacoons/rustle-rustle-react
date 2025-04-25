import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import * as pdfjs from 'pdfjs-dist/build/pdf';

import Paginator from './Paginator';

function PDFViewer({ pdfURL, pageNum, setPageNum }) {
    const containerRef = useRef(null);

    const resizeTimeoutRef = useRef(null); //debounce resizing
    const observerRef = useRef(null);
    const isMounted = useRef(false);

    const [pdfDocument, setPdfDocument] = useState(null);
    //const [anno, setAnno] = useState([]);
    const anno = useRef([]);

    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
    ).toString();

    const calculateScale = (page) => {
        //must happen after containerRef is loaded so checking is irrelevant
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        const viewport = page.getViewport({ scale: 1 });
        const isLandscape = viewport.width > viewport.height;

        let scaleWidth = containerWidth / viewport.width;
        let scaleHeight = containerHeight / viewport.height;

        //console.log(containerHeight)

        return Math.min(scaleWidth, scaleHeight);
    };

    const calculateCollision = (mouseX, mouseY) => {
        //         console.log(mouseX)
        //         console.log(mouseY)
        //         console.log(anno)
        for (const element of anno.current) {
            //             if (element.subtype == 'Square') {
            //                 if (
            //                     mouseX >= element.rect[0] &&
            //                     mouseX <= element.rect[0] + element.rect[2] &&
            //                     mouseY >= element.rect[1] &&
            //                     mouseY <= element.rect[1] + element.rect[3]
            //                 ) {
            //                 }
            //             }
        }
    };

    const renderPDF = async (pageNum) => {
        if (!pdfURL) return;
        try {
            //console.log(pdfjs.getDocument(""));
            const pdf = await pdfjs.getDocument(pdfURL).promise;
            setPdfDocument(pdf);

            const page = await pdf.getPage(pageNum);
            //console.log(page)

            const canvasContainer = containerRef.current;
            //some weird issue when toggling between pages sometime -> look into later?
            //             if(canvasContainer === null)
            //                 return;

            canvasContainer.innerHTML = '';

            const canvas = document.createElement('canvas');
            canvas.setAttribute('aria-label', 'pdf-display-canvas');

            canvasContainer.appendChild(canvas);

            const context = canvas.getContext('2d');
            const scale = calculateScale(page);
            const viewport = page.getViewport({ scale: scale });

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            //annotation processing
            const trackMousePosition = (event) => {
                const canvasRect = canvas.getBoundingClientRect(); // Get canvas position on the page
                const mouseX = event.clientX - canvasRect.left; // Calculate mouse X relative to canvas
                let mouseY = event.clientY - canvasRect.top; // Calculate mouse Y relative to canvas
                //mouseY = canvasRect.bottom - mouseY; //this logic is wrongn

                //console.log(mouseX);
                //console.log(mouseY);
                //console.log(scale)

                calculateCollision(mouseX / scale, mouseY / scale);
            };
            canvas.addEventListener('mousemove', trackMousePosition);

            page.getAnnotations().then((annotations) => {
                //let newAnnos = [];
                for (const element of annotations) {
                    // if (element.annotationType == 5) {
                    //newAnnos.push(element);
                    anno.current.push(element);
                    //}
                }
                //setAnno(newAnnos);
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
                if (!isMounted.current) {
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

    return (
        <div
            aria-label="pdf viewer"
            className="flex flex-col h-full w-full overflow-x-auto md:w-[calc(100%-300px)]"
        >
            <div
                ref={containerRef}
                className="grow h-full text-sky-900 dark:text-slate-300"
            >
                Loading...
            </div>
            <Paginator
                currPage={pageNum}
                maxPages={pdfDocument?.numPages}
                onChange={setPageNum}
            />
        </div>
    );
}

export default PDFViewer;
