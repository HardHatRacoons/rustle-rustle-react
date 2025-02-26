import { render, screen, fireEvent } from '@testing-library/react';

import Paginator from '../../src/components/Paginator';

describe('Testing paginator component', () => {
    test('No info provided', () => {
        render(<Paginator />);
    });

    test('Buttons work to change page', () => {
        let t = 1;
        const change = (num) => {
            t = num;
        };

        render(<Paginator onChange={change} currPage={t} maxPages={2} />);

        //tabs clickable and fire events
        expect(t).to.equal(1);
        fireEvent.click(screen.getByLabelText('next-page'));
        expect(t).to.equal(2);
        fireEvent.click(screen.getByLabelText('previous-page'));
        expect(t).to.equal(1);
    });

    test('Typing works to change page', () => {
        let t = 1;
        const change = (num) => {
            t = num;
        };

        render(<Paginator onChange={change} currPage={t} maxPages={2} />);

        const pageInput = screen.getByLabelText('page-number');

        fireEvent.change(pageInput, { target: { value: '2' } });
        expect(t).to.equal(2);
        fireEvent.change(pageInput, { target: { value: '1' } });
        expect(t).to.equal(1);
    });

    test('Cannot exceed boundaries of pagination with buttons', () => {
        let t = 1;
        const change = (num) => {
            t = num;
        };

        render(<Paginator onChange={change} currPage={t} maxPages={2} />);

        const pageInput = screen.getByLabelText('page-number');

        expect(t).to.equal(1);
        fireEvent.click(screen.getByLabelText('previous-page'));
        expect(t).to.equal(1);
        fireEvent.click(screen.getByLabelText('next-page'));
        expect(t).to.equal(2);
        fireEvent.click(screen.getByLabelText('next-page'));
        expect(t).to.equal(2);
    });

    test('No errors when entering invalid page number', () => {
        let t = 1;
        const change = (num) => {
            t = num;
        };

        render(<Paginator onChange={change} currPage={t} maxPages={2} />);

        const pageInput = screen.getByLabelText('page-number');

        fireEvent.change(pageInput, { target: { value: '' } });
        expect(t).to.equal(1);
        fireEvent.change(pageInput, { target: { value: 'a' } });
        expect(t).to.equal(1);
        fireEvent.change(pageInput, { target: { value: '3' } });
        expect(t).to.equal(1);
    });

    test('No errors when navigating after invalid page number', () => {
        let t = 1;
        const change = (num) => {
            t = num;
        };

        render(<Paginator onChange={change} currPage={t} maxPages={2} />);

        const pageInput = screen.getByLabelText('page-number');

        expect(t).to.equal(1);
        fireEvent.change(pageInput, { target: { value: 'a' } });
        expect(t).to.equal(1);
        fireEvent.click(screen.getByLabelText('previous-page'));
        expect(t).to.equal(1);
        fireEvent.click(screen.getByLabelText('next-page'));
        expect(t).to.equal(1);
    });
});
