import { render, screen, fireEvent, act } from '@testing-library/react';

import Card from '../../src/components/Card';

describe('Testing card component', () => {
    test('No info provided', () => {
        render(<Card />);
    });

    test('pin card', async() => {
        let t = false;
        let i = 1;
        const change = (val, idx) => {
            t = val;
            i = idx;
        };

        render(<Card onChange={change} idx={0} >Hello Hello</ Card>);

        //card pin click
        expect(t).to.equal(false);
        expect(i).to.equal(1);
        fireEvent.click(screen.getByLabelText('card-0'));
        await act(() => {});
        expect(t).to.equal(true);
        expect(i).to.equal(0);
    });
});
