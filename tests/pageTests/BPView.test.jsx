import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import BPView from '../../src/pages/BPView';
import { useOutletContext } from 'react-router';

vi.mock('react-router', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useOutletContext: vi.fn(),
    };
});

vi.mock('../../src/components/PDFViewer', () => ({
    __esModule: true,
    default: ({ pdfURL }) => <div>PDFViewer: {pdfURL}</div>,
}));

vi.mock('../../src/components/BPViewControlPanel', () => ({
    __esModule: true,
    default: ({ pdfInfo }) => (
        <div>BPViewControlPanel: {JSON.stringify(pdfInfo)}</div>
    ),
}));

describe('BPView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders PDFViewer and BPViewControlPanel with correct props', () => {
        const pdfInfo = {
            url: {
                annotated: { pdf: 'annotated.pdf', csv: 'annotated.csv' },
                unannotated: { pdf: 'unannotated.pdf' },
            },
        };

        useOutletContext.mockReturnValue(pdfInfo);

        render(
            <MemoryRouter initialEntries={['/bpview']}>
                <Routes>
                    <Route path="/bpview" element={<BPView />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(
            screen.getByText('PDFViewer: annotated.pdf'),
        ).toBeInTheDocument();
        expect(
            screen.getByText(`BPViewControlPanel: ${JSON.stringify(pdfInfo)}`),
        ).toBeInTheDocument();
    });

    test('renders unannotated PDF when annotated PDF is not ready', () => {
        const pdfInfo = {
            url: {
                annotated: {},
                unannotated: { pdf: 'unannotated.pdf' },
            },
        };

        useOutletContext.mockReturnValue(pdfInfo);

        render(
            <MemoryRouter initialEntries={['/bpview']}>
                <Routes>
                    <Route path="/bpview" element={<BPView />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(
            screen.getByText('PDFViewer: unannotated.pdf'),
        ).toBeInTheDocument();
        expect(
            screen.getByText(`BPViewControlPanel: ${JSON.stringify(pdfInfo)}`),
        ).toBeInTheDocument();
    });
});
