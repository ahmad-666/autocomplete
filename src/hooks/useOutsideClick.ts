import { RefObject, useEffect } from 'react';

//* Hook to detect clicks outside of a referenced element
export const useOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void) => {
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [ref, callback]);
};
