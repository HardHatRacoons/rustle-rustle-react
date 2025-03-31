import { useState } from 'react';

function Toggle({ onChange, initialValue, className }) {
    const [toggleValue, setToggleValue] = useState(initialValue);

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
            onClick={change}
        >
            <div
                className={`absolute rounded-xl self-center bg-white dark:bg-slate-300 mx-0.5 h-11/12 aspect-square transition duration-150 ease-linear ${toggleValue ? '' : ' translate-x-27/22'}`}
            />
        </div>
    );
}

export default Toggle;
