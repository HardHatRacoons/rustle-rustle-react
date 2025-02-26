import { render, screen, fireEvent } from '@testing-library/react';

import Home from '../../src/pages/Home';

describe('Testing home page', () => {
    test('Normal Load Home page', () => {
        render(<Home />);
    });

    test('Upload Modal open/close testing', () => {
        render(<Home />);

        fireEvent.click(screen.getByLabelText('open-upload-button'));
        expect(screen.getByText(/Upload File/)).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('close-upload-button'));
        expect(screen.queryByText(/Upload File/)).not.toBeInTheDocument();
    });

    test('Upload Modal open/close file input', () => {
        render(<Home />);

        //TBD
    });
});
