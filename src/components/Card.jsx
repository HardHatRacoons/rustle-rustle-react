import { useState, useEffect } from 'react';
import { TbPinFilled, TbPin } from 'react-icons/tb';

/*
 * Renders a pinnable card container with given children.
 *
 * @component
 * @param {Object} props
 * @param {ReactNode} props.children The children to be rendered inside the card.
 * @param {number} props.idx The index of the card, if applicable.
 * @param {boolean} props.pin The pin status of the card.
 * @param {(idx: number) => void} props.onChange function to be called when the pin is clicked
 * @returns rendered card component.
 */
function Card({ children, idx, pin, onChange }) {
    const onPin = () => {
        onChange(idx);
    };

    return (
        <div className="w-full h-full shadow-lg rounded-md text-sky-900 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-800 flex flex-col place-items-center">
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
