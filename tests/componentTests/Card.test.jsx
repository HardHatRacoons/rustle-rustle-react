import { render, screen, fireEvent, act } from '@testing-library/react';

import Card from '../../src/components/Card';

describe('Testing card component', () => {
    test('No info provided', () => {
        render(<Card />);
    });

    test('pin card', async () => {
        let i = 1;
        const change = (idx) => {
            i = idx;
        };

        render(
            <Card onChange={change} idx={0}>
                Hello Hello
            </Card>,
        );

        //card pin click
        expect(i).to.equal(1);
        fireEvent.click(screen.getByLabelText('card-0'));
        await act(() => {});
        expect(i).to.equal(0);
    });

    test('check pin state', async () => {
        render(
            <Card idx={0} pin={true}>
                Hello Hello
            </Card>,
        );

        await act(() => {});
    });
});
