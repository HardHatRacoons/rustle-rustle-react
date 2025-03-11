import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import BPViewControlPanel from '../../src/components/BPViewControlPanel';

describe('BPViewControlPanel', () => {
    test('renders with missing download links', () => {
        const pdfInfo = {
            url: {
                annotated: { pdf: null, csv: null },
                unannotated: { pdf: 'unannotated.pdf' },
            },
        };

        render(<BPViewControlPanel pdfInfo={pdfInfo} />);

        expect(screen.getByText(/Downloads:/)).toBeInTheDocument();
        expect(screen.getByText(/Annotations/)).toBeInTheDocument();
        expect(screen.getByText(/Data/)).toBeInTheDocument();
        expect(screen.getByText(/Original/)).toBeInTheDocument();
        expect(screen.getByText(/Blueprint currently processing/)).toBeInTheDocument();
    });

    test('renders with all download links available', () => {
        const pdfInfo = {
            url: {
                annotated: { pdf: 'annotated.pdf', csv: 'annotated.csv' },
                unannotated: { pdf: 'unannotated.pdf' },
            },
        };

        render(<BPViewControlPanel pdfInfo={pdfInfo} />);

        expect(screen.getByText(/Downloads:/)).toBeInTheDocument();
        expect(screen.getByText(/Annotations/)).toBeInTheDocument();
        expect(screen.getByText(/Data/)).toBeInTheDocument();
        expect(screen.getByText(/Original/)).toBeInTheDocument();
        expect(screen.queryByText(/Blueprint currently processing/)).not.toBeInTheDocument();
    });
});
