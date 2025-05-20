import { useState, useEffect, useCallback, type RefObject } from 'react';

const useClickOutside = (ref: RefObject<HTMLElement>, cb?: (e: MouseEvent) => void) => {
    const [isClickOutside, setIsClickOutside] = useState(false);
    const clickHandler = useCallback(
        (e: MouseEvent) => {
            const elm = ref.current;
            if (elm) {
                const clickedOutside = !elm.contains(e.target as HTMLElement);
                setIsClickOutside(clickedOutside);
                if (clickedOutside && cb) cb(e);
            }
        },
        [ref, cb]
    );
    useEffect(() => {
        document.addEventListener('click', clickHandler);
        return () => {
            document.removeEventListener('click', clickHandler);
        };
    }, [clickHandler]);
    return isClickOutside;
};

export default useClickOutside;

//? Example
// const ref = useRef<HTMLDivElement>(null!);
// const isClickedOutside = useClickOutside(ref, () => {//outside});
// <div ref={ref} className='aspect-square w-40 bg-primary'></div>
