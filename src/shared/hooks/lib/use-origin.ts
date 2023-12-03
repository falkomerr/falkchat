import { useEffect, useState } from 'react';

export const useOrigin = () => {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const origin =
        typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    if (!mounted) {
        return null;
    }

    return origin;
};
