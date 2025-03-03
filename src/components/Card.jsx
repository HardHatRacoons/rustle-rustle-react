import { useState, useEffect } from 'react';
import { TbPinFilled, TbPin } from 'react-icons/tb';

function Card({ children, idx, onChange }) {
    const [pin, setPin] = useState(false);
    const onPin = () => {
        const tempPin = !pin;
        setPin(tempPin);
        onChange(tempPin, idx);
    };

    return (
        <div
            className="w-full h-full shadow-lg rounded-md border-2 border-slate-100 flex flex-col place-items-center"
            aria-label={"card-" + idx}
            onClick={onPin}
        >
            <div className="h-5 pt-2 w-full flex">
                <div className="ml-auto my-auto px-5">
                    {pin ? <TbPinFilled size="20" /> : <TbPin size="20" />}
                </div>
            </div>
            <div className="px-5 pb-5">{children}</div>
        </div>
    );
}

export default Card;
