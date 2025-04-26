import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import * as pdfjs from 'pdfjs-dist/build/pdf';

import Paginator from './Paginator';

/*
 * Renders a canvas containing the given pdf with pagination.
 *
 * @component
 * @param {Object} props
 * @param {number} props.pdfURL The url of the pdf to be rendered.
 * @param {number} props.pageNum The page number to be displayed intially.
 * @param {(i: number) => void} props.setPageNum The setter function to change the page number.
 * @returns rendered pdf.
 */
function PDFViewer({ pdfURL, pageNum, setPageNum }) {
    const containerRef = useRef(null);

    const resizeTimeoutRef = useRef(null); //debounce resizing
    const observerRef = useRef(null);
    const isMounted = useRef(false);

    const [pdfDocument, setPdfDocument] = useState(null);
    const anno = useRef([]);

    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
    ).toString();

    /*
     * calculates the correct scale of the page to fit the canvas
     *
     * @function
     * @param {Object} page The page of the document find the correct render scale of.
     * @returns the scale to use.
     */
    const calculateScale = (page) => {
        //must happen after containerRef is loaded so checking is irrelevant
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        const viewport = page.getViewport({ scale: 1 });
        const isLandscape = viewport.width > viewport.height;

        let scaleWidth = containerWidth / viewport.width;
        let scaleHeight = containerHeight / viewport.height;

        return Math.min(scaleWidth, scaleHeight);
    };

    /*
     * Calculates if a user is mousing over an annotation.
     *
     * @function
     * @param {number} mouseX x value position of the mouse.
     * @param {number} mouseY y value position of the mouse.
     */
    const calculateCollision = (mouseX, mouseY) => {
        for (const element of anno.current) {
            // feature was removed from feature list so function is unfilled
        }
    };

    /*
     * Renders the pdf page.
     *
     * @function
     * @param {number} pageNum The page number of the page to be rendered.
     */
    const renderPDF = async (pageNum) => {
        if (!pdfURL) return;
        try {
            const pdf = await pdfjs.getDocument(pdfURL).promise;
            setPdfDocument(pdf);

            const page = await pdf.getPage(pageNum);

            const canvasContainer = containerRef.current;

            //clear canvas container of previous content
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
                const canvasRect = canvas.getBoundingClientRect(); //get canvas position on the page
                const mouseX = event.clientX - canvasRect.left;
                let mouseY = event.clientY - canvasRect.top; //logic is messed up due to pdf diffs

                calculateCollision(mouseX / scale, mouseY / scale);
            };
            canvas.addEventListener('mousemove', trackMousePosition);

            page.getAnnotations().then((annotations) => {
                for (const element of annotations) {
                    //parse annotations here
                }
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
            }, 500); //debounce
        };

        if (observerRef.current) {
            //disconnect the old observer
            observerRef.current.disconnect();
        }

        const resizeObserver = new ResizeObserver(resizeHandler);
        observerRef.current = resizeObserver;

        resizeObserver.observe(document.body);

        //clean up the observer on unmount
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
