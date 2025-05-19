import { useState, useEffect, useCallback, type RefObject } from 'react';

type Args = {
    ref: RefObject<HTMLElement>;
    cb?: (isHover: boolean) => void;
};

const useHover = ({ ref, cb }: Args) => {
    const [isHover, setIsHover] = useState(false);
    const onEnter = useCallback(() => {
        setIsHover(true);
        cb?.(true);
    }, [cb]);
    const onLeave = useCallback(() => {
        setIsHover(false);
        cb?.(false);
    }, [cb]);
    useEffect(() => {
        const elm = ref.current;
        if (elm) {
            elm.addEventListener('mouseenter', onEnter);
            elm.addEventListener('mouseleave', onLeave);
            return () => {
                elm.removeEventListener('mouseenter', onEnter);
                elm.removeEventListener('mouseleave', onLeave);
            };
        }
    }, [ref, onEnter, onLeave]);
    return isHover;
};

export default useHover;

//? Usage:
// const ref = useRef<HTMLButtonElement>(null!);
// const isHover = useHover({ref,cb: (isHover) => {}});
// <button ref={ref}>click me</button>
