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
            className={`rounded-xl border-solid border-2 border-white dark:border-slate-400 relative h-full aspect-2/1 cursor-pointer flex ${
                className ? className : ''
            }`}
            onClick={change}
        >
            <div
                className={`absolute rounded-xl self-center bg-white dark:bg-slate-400 m-0.25 h-11/12 aspect-square transition duration-150 ease-linear ${toggleValue ? '' : ' translate-x-13/11'}`}
            />
        </div>
    );
}

export default Toggle;
