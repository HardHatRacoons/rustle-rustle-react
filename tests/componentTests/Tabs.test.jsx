import { render, screen, fireEvent } from '@testing-library/react';

import Tabs from '../../src/components/Tabs';

describe('Testing tabs component', () => {
    test('All tabs appear', () => {
        const tabs = ['1', '2', '3'];
        const change = () => {};

        //add className to fully test all paths -> cant test if styling applies with vitest
        render(<Tabs onChange={change} tabs={tabs} className="bg-sky-200" />);

        //all tabs show up
        expect(screen.getByText(/1/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
        expect(screen.getByText(/3/)).toBeInTheDocument();
    });

    test('Tabs change when clicked', () => {
        const tabs = ['1', '2'];
        let t = 0;
        let activeT = 0;
        const setActiveT = (num) => {
            activeT = num;
        };
        const change = (num) => {
            t = num;
        };

        render(
            <Tabs
                onChange={change}
                tabs={tabs}
                activeTab={activeT}
                setActiveTab={setActiveT}
            />,
        );
        //both tabs show up
        expect(screen.getByText(/1/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();

        //tabs clickable and fire events
        expect(t).to.equal(0);
        expect(activeT).to.equal(0);
        fireEvent.click(screen.getByText(/2/));
        expect(t).to.equal(1);
        expect(activeT).to.equal(1);
        fireEvent.click(screen.getByText(/1/));
        expect(t).to.equal(0);
        expect(activeT).to.equal(0);
    });
});
