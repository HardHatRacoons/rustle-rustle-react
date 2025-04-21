import { useState, useEffect } from 'react';
import { TbPinFilled, TbPin } from 'react-icons/tb';

function Card({ children, idx, pin, onChange }) {
    const onPin = () => {
        onChange(idx);
    };

    return (
        <div className="w-full h-full shadow-lg rounded-md  text-sky-900 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-800 flex flex-col place-items-center">
            <div className="h-5 pt-5 p-5 w-full flex">
                <div
                    className="ml-auto my-auto hover:cursor-pointer hover:text-sky-700 dark:hover:text-slate-200"
                    aria-label={'card-' + idx}
                    onClick={onPin}
                >
                    {pin ? <TbPinFilled size="30" /> : <TbPin size="30" />}
                </div>
            </div>
            <div className="px-5 pb-5">{children}</div>
        </div>
    );
}

export default Card;
