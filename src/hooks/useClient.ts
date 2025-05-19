import { useState, useEffect } from 'react';

const useClient = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return isClient;
};

export default useClient;

//? Example
// const isClient = useClient()
//* Tips:
// const isServer = typeof window === 'undefined'
