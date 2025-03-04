import { render, screen, fireEvent } from '@testing-library/react';

import MetricView from '../../src/pages/MetricView';

describe('Testing metric view page', () => {
    test('Normal Load MetricView page', () => {
        render(<MetricView />);
    });

    test('Try pinning', () => {
        render(<MetricView />);

        const card1 = screen.getByLabelText('card-0');
        const card2 = screen.getByLabelText('card-1');
        const card3 = screen.getByLabelText('card-2');

        //fix this later; the logic is a little weird so need to investigate
        expect(card1.compareDocumentPosition(card2)).toBe(4);
        expect(card2.compareDocumentPosition(card3)).toBe(4);

        fireEvent.click(card3);

        expect(card3.compareDocumentPosition(card1)).toBe(4);
        expect(card3.compareDocumentPosition(card2)).toBe(4);
        expect(card1.compareDocumentPosition(card2)).toBe(4);
    });

    test('Try unpinning too', () => {
        render(<MetricView />);

        const card1 = screen.getByLabelText('card-0');
        const card2 = screen.getByLabelText('card-1');
        const card3 = screen.getByLabelText('card-2');

        //fix this later
        expect(card1.compareDocumentPosition(card2)).toBe(4);
        expect(card2.compareDocumentPosition(card3)).toBe(4);

        fireEvent.click(card3);

        expect(card3.compareDocumentPosition(card1)).toBe(4);
        expect(card3.compareDocumentPosition(card2)).toBe(4);
        expect(card1.compareDocumentPosition(card2)).toBe(4);

        fireEvent.click(card3);

        expect(card1.compareDocumentPosition(card2)).toBe(4);
        expect(card2.compareDocumentPosition(card3)).toBe(4);
    });
});
