import { render, screen, fireEvent, act } from '@testing-library/react';

import Toggle from '../../src/components/Toggle';

describe('Testing toggle component', () => {
    test('No info provided', () => {
        render(<Toggle />);
    });

    test('toggle', async () => {
        let i = false;
        const change = (value) => {
            i = value;
        };

        render(
            <Toggle
                onChange={change}
                inotialValue={false}
                className="relative"
            />,
        );

        //card pin click
        expect(i).to.equal(false);
        fireEvent.click(screen.getByLabelText('theme-toggle'));
        await act(() => {});
        expect(i).to.equal(true);
    });
});
