import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import Home from '../../src/pages/Home';
import { beforeAll } from 'vitest';
import { useUser } from '../../src/components/UserContext';
import { list, getProperties } from 'aws-amplify/storage';
import { MemoryRouter } from 'react-router';

class MockFile {
    constructor(content, name, options = {}) {
        this.name = name;
        this.size = content.length;
        this.type = options.type || 'application/octet-stream'; // Default to generic type
        this.lastModified = options.lastModified || new Date().getTime(); // Default to current time
        this.arrayBuffer = async () => {
            const encoder = new TextEncoder();
            const data = encoder.encode(content);
            return data;
        };
        this.content = content;
    }
}

describe('Testing home page', () => {
    beforeAll(() => {
        vi.mock(import('react-router'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                useNavigate: vi.fn().mockReturnValue(
                    vi.fn().mockImplementation((params) => {
                        console.log(params);
                    }),
                ),
            };
        });

        vi.mock('../../src/components/UserContext', () => ({
            useUser: vi
                .fn()
                .mockReturnValueOnce({ sub: 'testuser' })
                .mockReturnValueOnce({ sub: 'testuser' })
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(null)
                .mockReturnValue({ sub: 'testuser' }),
        }));

        vi.mock('aws-amplify/storage', async (importOriginal) => {
            let t = 2;
            const actual = await importOriginal();
            return {
                ...actual,
                list: vi
                    .fn()
                    .mockRejectedValueOnce(new Error('bucket not found'))
                    .mockImplementation(async () => {
                        return t++ === 1
                            ? {
                                  items: [
                                      { path: 'annotated/testuser/file1.pdf' },
                                  ],
                              }
                            : {
                                  items: [
                                      { path: 'annotated/testuser/file1.pdf' },
                                      { path: 'annotated/testuser/file2.pdf' },
                                  ],
                              };
                    }),
                getProperties: vi
                    .fn()
                    .mockResolvedValueOnce({ metadata: {} })
                    .mockRejectedValueOnce(new Error('file not found'))
                    .mockImplementation(async (path) => {
                        return {
                            metadata: { name: path.path.split('/').at(-1) },
                        };
                    }),
                uploadData: vi.fn().mockImplementation(async (params) => {
                    //unknown if this is needed :/
                    return {
                        state: 'SUCCESS',
                    };
                }),
                remove: vi
                    .fn()
                    .mockRejectedValueOnce(new Error('file not found'))
                    .mockRejectedValueOnce(new Error('file not found'))
                    .mockImplementation(async (params) => {
                        t = 1;
                    }),
            };
        });

        vi.mock(import('pdfjs-dist'), async (importOriginal) => {
            const actual = await importOriginal();
            const standardA4Width = 595;
            const standardA4Height = 842;

            // Create a custom mock for getDocument
            const getDocumentMock = vi.fn().mockImplementation((url) => {
                //if (url === 'https://fake-pdf-endpoint/pdf.pdf') {
                return {
                    promise: {
                        numPages: 1, // Simulate a PDF with 2 pages for more complex testing
                        getPage: vi.fn().mockImplementation(async (pageNum) => {
                            // Simulate different pages based on pageNum
                            if (pageNum === 1) {
                                return Promise.resolve({
                                    pageNumber: 1,
                                    rotate: 0, // The page rotation in degrees
                                    width: standardA4Width, // Page width in PDF units (1/72 inch)
                                    height: standardA4Height, // Page height in PDF units (1/72 inch)

                                    getViewport: vi
                                        .fn()
                                        .mockImplementation((options) => {
                                            // Scale the width and height based on the provided scale factor
                                            const scale = options.scale || 1;
                                            const width =
                                                standardA4Width * scale;
                                            const height =
                                                standardA4Height * scale;

                                            // Return the viewport object that includes the scaled dimensions
                                            return {
                                                width,
                                                height,
                                                scale,
                                            };
                                        }),
                                    render: vi
                                        .fn()
                                        .mockImplementation(async(renderContext) => {
                                            const ctx =
                                                renderContext.canvasContext;
                                            console.log(ctx);
                                            ctx.fillText(
                                                'Page 1 content',
                                                0,
                                                0,
                                            );
                                            return true;
                                        }),
                                });
                            }
                        }),
                    },
                };
                //} else return Promise.reject(new Error('File not found'));
            });

            return {
                ...actual,
                getDocument: getDocumentMock, // Mock the original getDocument method
            };
        });

        // vi.stubGlobal('URL', {
        //     createObjectURL: vi.fn(() => 'mocked-url'),
        // });

        global.URL = class {
            constructor(url) {
                this.url = url;
            }
            toString() {
                return this.url;
            }
        };

        global.URL.createObjectURL = function (file) {
            return 'mocked-url';
        };
    });

    test('listing file error', async () => {
        const consoleSpy = vi.spyOn(console, 'error');
        render(<Home />);
        await act(async () => {});

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching('Error listing files:'),
            expect.anything(),
        );
    });

    test('one file unnamed, one file not found when getting files in filelist', async () => {
        const consoleSpy = vi.spyOn(console, 'error');
        render(<Home />);
        await act(async () => {});

        expect(screen.getAllByText(/Document/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Document/)[1]).toBeInTheDocument();
        expect(consoleSpy).toHaveBeenNthCalledWith(
            2,
            expect.stringMatching('Error fetching metadata:'),
            expect.anything(),
        );
    });

    test('no user', async () => {
        render(<Home />);
        await act(async () => {});

        fireEvent.click(screen.getByLabelText('open-upload-button'));
        await act(async () => {});
        expect(screen.getByText(/Upload File/)).toBeInTheDocument();
    });

    test('cant delete files bc dne', async () => {
        const consoleSpy = vi.spyOn(console, 'error');
        render(<Home />);
        await act(async () => {});

        fireEvent.click(screen.getByLabelText('file-delete-button-1'));
        fireEvent.click(screen.getByLabelText('confirm-delete-button'));
        fireEvent.click(screen.getByLabelText('refresh-button'));
        await act(async () => {});

        expect(consoleSpy).toHaveBeenNthCalledWith(
            3,
            expect.stringMatching('Error deleting file:'),
            expect.anything(),
        );
        expect(consoleSpy).toHaveBeenNthCalledWith(
            4,
            expect.stringMatching('Error deleting file:'),
            expect.anything(),
        );
    });

    test('Normal Load Home page', async () => {
        render(<Home />);

        await act(async () => {});
    });

    test('Upload Modal open/close testing', async () => {
        render(<Home />);

        fireEvent.click(screen.getByLabelText('open-upload-button'));
        await act(async () => {});
        expect(screen.getByText(/Upload File/)).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('close-upload-button'));
        await act(async () => {});
        expect(screen.queryByText(/Upload File/)).not.toBeInTheDocument();
    });

    test('file input and deletion testing', async () => {
        const fillTextSpy = vi.fn();
        HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
            fillText: fillTextSpy,
        }));

        const consoleSpy = vi.spyOn(console, 'log');
        render(<Home />);
        fireEvent.click(screen.getByLabelText('open-upload-button'));

        const input = document.querySelector(
            'input[type="file"][accept=".pdf"]',
        );

        const fakeFile = new MockFile(['data'], 'example.pdf', {
            type: 'application/pdf',
            lastModified: new Date().getTime(),
        });
        fireEvent.change(input, {
            target: { files: [fakeFile] },
        });

        fireEvent.click(screen.getByText('Upload 1 file'));
        fireEvent.click(screen.getByLabelText('close-upload-button'));
        await act(async () => {});

        //expect(screen.getByText(/example.pdf/)).toBeInTheDocument();
        expect(screen.getByText(/file1/)).toBeInTheDocument();
        expect(screen.getByText(/file2/)).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('file-delete-button-1'));
        fireEvent.click(screen.getByLabelText('cancel-delete-button'));
        await act(async () => {});
        expect(screen.getByText(/file1/)).toBeInTheDocument();
        expect(screen.getByText(/file2/)).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('file-delete-button-1'));
        fireEvent.click(screen.getByLabelText('confirm-delete-button'));
        fireEvent.click(screen.getByLabelText('refresh-button'));
        await act(async () => {});
        expect(screen.getByText(/file1/)).toBeInTheDocument();
        expect(screen.queryByText(/file2/)).not.toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('file-navigate-0'));
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching('/file/file1'),
        );
    });
});
