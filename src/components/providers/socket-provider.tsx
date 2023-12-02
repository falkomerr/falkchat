'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';

type contextType = {
    socket: any | null;
    isConnected: boolean;
};

const socketContext = createContext<contextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(socketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: '/api/socket/io',
            addTrailingSlash: false,
        });

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <socketContext.Provider value={{ socket, isConnected }}>{children}</socketContext.Provider>
    );
};
