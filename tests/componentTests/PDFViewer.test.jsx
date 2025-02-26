import {
    render,
    screen,
    fireEvent,
    act,
    unmountComponentAtNode,
} from '@testing-library/react';
import React from 'react';

import PDFViewer from '../../src/components/PDFViewer';

describe('Testing pdfviewer component', () => {
    beforeAll(() => {
        vi.mock(import('pdfjs-dist'), async (importOriginal) => {
            const actual = await importOriginal();
            const standardA4Width = 595;
            const standardA4Height = 842;

            const annotations = vi.fn().mockImplementation(async (options) => {
                // Return the viewport object that includes the scaled dimensions
                return Promise.resolve(['anno1', 'anno2', 'anno3']);
            });

            // Create a custom mock for getDocument
            const getDocumentMock = vi.fn().mockImplementation((url) => {
                if (url === 'https://fake-pdf-endpoint/pdf.pdf') {
                    return {
                        promise: {
                            numPages: 2, // Simulate a PDF with 2 pages for more complex testing
                            getPage: vi
                                .fn()
                                .mockImplementation(async (pageNum) => {
                                    // Simulate different pages based on pageNum
                                    if (pageNum === 1) {
                                        return Promise.resolve({
                                            pageNumber: 1,
                                            rotate: 0, // The page rotation in degrees
                                            width: standardA4Width, // Page width in PDF units (1/72 inch)
                                            height: standardA4Height, // Page height in PDF units (1/72 inch)

                                            getViewport: vi
                                                .fn()
                                                .mockImplementation(
                                                    (options) => {
                                                        // Scale the width and height based on the provided scale factor
                                                        const scale =
                                                            options.scale || 1;
                                                        const width =
                                                            standardA4Width *
                                                            scale;
                                                        const height =
                                                            standardA4Height *
                                                            scale;

                                                        // Return the viewport object that includes the scaled dimensions
                                                        return {
                                                            width,
                                                            height,
                                                            scale,
                                                        };
                                                    },
                                                ),
                                            getAnnotations: annotations,
                                            render: vi
                                                .fn()
                                                .mockImplementation(
                                                    (renderContext) => {
                                                        const ctx =
                                                            renderContext.canvasContext;
                                                        ctx.fillText(
                                                            'Page 1 content',
                                                            0,
                                                            0,
                                                        );
                                                    },
                                                ),
                                        });
                                    } else if (pageNum === 2) {
                                        return Promise.resolve({
                                            pageNumber: 2,
                                            rotate: 0, // The page rotation in degrees
                                            width: standardA4Height, // Page width in PDF units (1/72 inch)
                                            height: standardA4Width, // Page height in PDF units (1/72 inch)

                                            getViewport: vi
                                                .fn()
                                                .mockImplementation(
                                                    (options) => {
                                                        // landscape
                                                        const scale =
                                                            options.scale || 1;
                                                        const width =
                                                            standardA4Height *
                                                            scale;
                                                        const height =
                                                            standardA4Width *
                                                            scale;

                                                        // Return the viewport object that includes the scaled dimensions
                                                        return {
                                                            width,
                                                            height,
                                                            scale,
                                                        };
                                                    },
                                                ),
                                            getAnnotations: annotations,
                                            render: vi
                                                .fn()
                                                .mockImplementation(
                                                    (renderContext) => {
                                                        const ctx =
                                                            renderContext.canvasContext;
                                                        ctx.fillText(
                                                            'Page 2 content',
                                                            0,
                                                            0,
                                                        );
                                                    },
                                                ),
                                        });
                                    }
                                    return Promise.reject(
                                        new Error('Page not found'),
                                    );
                                }),
                        },
                    };
                } else return Promise.reject(new Error('File not found'));
            });

            return {
                ...actual,
                getDocument: getDocumentMock, // Mock the original getDocument method
            };
        });

        //sim environment so no resize observer
        global.ResizeObserver = class {
            constructor(resizeHandler) {
                this.resizeHandler = resizeHandler;
            }

            observe(documentBody) {
                // Call the handler immediately
                this.resizeHandler();

                // trigger resize event and debounce after initial mount
                setTimeout(() => {
                    this.resizeHandler();
                    setTimeout(() => {
                        this.resizeHandler();
                    }, 50);
                }, 510);
            }
            disconnect() {}
        };

        const mockGetBoundingClientRect = vi.fn().mockReturnValue({
            width: 200,
            height: 100,
            top: 0,
            left: 0,
            right: 200,
            bottom: 100,
        });

        // Step 2: Apply the mock to the global document's elements prototype
        // This is important to mock it for elements in the DOM
        global.Element.prototype.getBoundingClientRect =
            mockGetBoundingClientRect;
    });

    test('No info provided', async () => {
        render(<PDFViewer />);

        await act(async () => {
            // wait for render to finish
        });
    });

    test('classname test', async () => {
        render(<PDFViewer className="bg-sky-200" />);

        await act(async () => {
            // wait for render to finish
        });
    });

    test('Incorrect url', async () => {
        //test no pdf found error branch
        render(<PDFViewer pdfURL="https://pdf-not-found.pdf" />);

        await act(async () => {
            // wait for render to finish
        });
    });

    test('Testing with given url', async () => {
        const fillTextSpy = vi.fn();

        HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
            fillText: fillTextSpy,
        }));

        vi.useFakeTimers();

        //call in strict mode to test double use effect calls
        const { unmount } = render(
            <React.StrictMode>
                <PDFViewer pdfURL={'https://fake-pdf-endpoint/pdf.pdf'} />
            </React.StrictMode>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(fillTextSpy).toHaveBeenCalledWith('Page 1 content', 0, 0);
        expect(fillTextSpy).toHaveBeenCalledTimes(2);

        await act(async () => {
            fireEvent.click(screen.getByLabelText('next-page'));
        });

        expect(fillTextSpy).toHaveBeenCalledWith('Page 2 content', 0, 0);
        expect(fillTextSpy).toHaveBeenCalledTimes(3);

        //test invalid page (this actually doesnt work bc the paginator error checking catches it instead)
        await act(async () => {
            fireEvent.click(screen.getByLabelText('next-page'));
        });

        //trigger cleanup calls
        vi.useRealTimers();
        unmount();
    });

    test('Testing resize observer resizes', async () => {
        const fillTextSpy = vi.fn();

        HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
            fillText: fillTextSpy,
        }));

        vi.useFakeTimers();

        //call in strict mode to test double use effect calls
        const { unmount } = render(
            <React.StrictMode>
                <PDFViewer pdfURL={'https://fake-pdf-endpoint/pdf.pdf'} />
            </React.StrictMode>,
        );

        await act(async () => {
            // wait for render to finish
        });

        vi.advanceTimersByTime(510);

        await act(async () => {
            // wait for render to finish
        });

        expect(fillTextSpy).toHaveBeenCalledTimes(2);

        vi.advanceTimersByTime(1070);

        await act(async () => {
            // wait for render to finish
        });

        expect(fillTextSpy).toHaveBeenCalledTimes(3);

        //trigger cleanup calls
        vi.useRealTimers();
        unmount();
    });

    test('Testing annotation mouseOvers', async () => {
        const fillTextSpy = vi.fn();

        HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
            fillText: fillTextSpy,
        }));

        vi.useFakeTimers();

        //call in strict mode to test double use effect calls
        render(<PDFViewer pdfURL={'https://fake-pdf-endpoint/pdf.pdf'} />);

        await act(async () => {
            // wait for render to finish
        });

        const canvas = screen.getByLabelText('pdf display canvas');

        await act(async () => {
            fireEvent.mouseMove(canvas, {
                clientX: 100,
                clientY: 150,
            });
        });

        //trigger cleanup calls
        vi.useRealTimers();
    });
});
