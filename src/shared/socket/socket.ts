'use client'

import { createContext, useContext } from 'react';

type contextType = {
    socket: any | null;
    isConnected: boolean;
};

export const socketContext = createContext<contextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(socketContext);
};
