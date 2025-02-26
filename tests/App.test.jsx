import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import * as Storage from 'aws-amplify/storage';
import * as PDFJS from 'pdfjs-dist';

import App from '../src/App';

describe('Testing main setup and routing', () => {
    // render app to test
    beforeAll(() => {
        //     render(
        //       <MemoryRouter>
        //         <App />
        //       </MemoryRouter>
        //     );

        vi.mock(import('aws-amplify/storage'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                getUrl: vi.fn().mockResolvedValue({
                    url: new URL('https://fake-pdf-endpoint/pdf.pdf'),
                }),
            };
        });

        vi.mock(import('pdfjs-dist'), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                getDocument: vi.fn().mockResolvedValue({
                    numPages: 1,
                    getPage: vi.fn().mockResolvedValue({
                        getTextContent: vi
                            .fn()
                            .mockResolvedValue({ items: [] }),
                    }),
                }),
            };
        });

        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    test('home page should be rendered first', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Hello/)).toBeInTheDocument();
        expect(screen.getByText(/Gallery/)).toBeInTheDocument();
        expect(screen.getByText(/Upload/)).toBeInTheDocument();
    });

    test('can move to blueprint page', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/blueprint']}>
                <App />
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('pdf viewer')).toBeInTheDocument();
    });

    test('can move to table page', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/table']}>
                <App />
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('table')).toBeInTheDocument();
    });

    test('can move to metric page', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/metrics']}>
                <App />
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('metrics')).toBeInTheDocument();
    });

    test('can move between pages with navbar', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/blueprint']}>
                <App />
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('pdf viewer')).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Table/));
        expect(screen.getByLabelText('table')).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Metrics/));
        expect(screen.getByLabelText('metrics')).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Blueprint/));
        expect(screen.getByLabelText('pdf viewer')).toBeInTheDocument();
    });

    test('back button returns to home', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123/blueprint']}>
                <App />
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        fireEvent.click(screen.getByLabelText('back'));
        expect(screen.getByText(/Hello/)).toBeInTheDocument();
        expect(screen.getByText(/Gallery/)).toBeInTheDocument();
        expect(screen.getByText(/Upload/)).toBeInTheDocument();
    });

    test('trying to hit file route goes to blueprint as default', async () => {
        render(
            <MemoryRouter initialEntries={['/file/123']}>
                <App />
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByLabelText('pdf viewer')).toBeInTheDocument();
    });

    test('error when accessing nonexistent route', () => {
        render(
            <MemoryRouter initialEntries={['/randomroute']}>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Error/)).toBeInTheDocument();

        //go back home
        fireEvent.click(screen.getByLabelText('back'));
        expect(screen.getByText(/Hello/)).toBeInTheDocument();
        expect(screen.getByText(/Gallery/)).toBeInTheDocument();
        expect(screen.getByText(/Upload/)).toBeInTheDocument();
    });

    test('error when loading nonexistent file', async () => {
        render(
            <MemoryRouter initialEntries={['/file/12']}>
                <App />
            </MemoryRouter>,
        );

        await act(async () => {
            // wait for render to finish
        });

        expect(screen.getByText(/Error/)).toBeInTheDocument();
    });
});
