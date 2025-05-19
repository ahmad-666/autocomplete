import { useState, useRef, useEffect } from 'react';

type Props<T> = {
    value: T;
    timeout?: number;
    cb?: (debounceVal: T) => void;
};

const useDebounce = <T>({ value, timeout = 500, cb }: Props<T>) => {
    const timer = useRef<NodeJS.Timeout>(null!);
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(() => {
        timer.current = setTimeout(() => {
            setDebounceValue(value);
            cb?.(value);
        }, timeout);
        return () => {
            clearTimeout(timer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, timeout]);

    return { debounceValue };
};

export default useDebounce;

//? Usage:
//* with return value:
// const [value, setValue] = useState('')
// const { debounceValue } = useDebounce({ value }) //use debounceValue for queryKey of react-query or http req
// <input value={value} onChange={(e) => setValue(e.target.value)} />
//* with callback:
// const [search, setSearch] = useState('');
// const [debounceSearch, setDebounceSearch] = useState('');
// useDebounce({value: search,timeout: 1000,
//     cb: (debounceVal) => {
//         if (debounceVal.length >= 3) {
//             setDebounceSearch(debounceVal);
//             setPagination({ page: 1, pageSize: 10 });
//         }
//     }
// });
