import { useState } from 'react';

/*
 * Renders a toggle interactable.
 *
 * @component
 * @param {Object} props
 * @param {(i: boolean) => void} props.onChange The function to call when the toggle is clicked.
 * @param {boolean} props.initialValue initial value of the toggle.
 * @param {String} props.className classNames to add to the tabs for styling.
 * @returns {React.ReactElement} the rendered toggle.
 */
function Toggle({ onChange, initialValue, className }) {
    const [toggleValue, setToggleValue] = useState(initialValue);

    /*
     * The callback for a toggle event.
     *
     * @function
     */
    const change = () => {
        let tempValue = !toggleValue;
        setToggleValue(tempValue);
        onChange(tempValue);
    };

    return (
        <div
            className={`rounded-xl border-solid border-3 border-white dark:border-slate-300 relative h-3/5 aspect-2/1 cursor-pointer flex ${
                className ? className : ''
            }`}
            aria-label="theme-toggle"
            onClick={change}
        >
            <div
                className={`absolute rounded-xl self-center bg-white dark:bg-slate-300 mx-0.5 h-11/12 aspect-square transition duration-150 ease-linear ${toggleValue ? '' : ' translate-x-27/22'}`}
            />
        </div>
    );
}

export default Toggle;
