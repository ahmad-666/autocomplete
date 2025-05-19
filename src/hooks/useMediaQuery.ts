import { useState, useEffect } from 'react';

const useMediaQuery = (query: string) => {
    const [isMatch, setIsMatch] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia(query).matches : false
    );
    const onMediaChange = (e: MediaQueryListEvent) => {
        setIsMatch(e.matches);
    };
    useEffect(() => {
        const media = window.matchMedia(query);
        setIsMatch(media.matches);
        media.addEventListener('change', onMediaChange);
        return () => {
            media.removeEventListener('change', onMediaChange);
        };
    }, [query]);
    return isMatch;
};

export default useMediaQuery;

//? Usage: useMediaQuery('(width < 500px)')
