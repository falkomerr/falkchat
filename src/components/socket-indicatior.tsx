'use client';

import { Loader2 } from 'lucide-react';
import { useSocket } from './providers/socket-provider';

export const SocketIndicator = ({}) => {
    const { isConnected } = useSocket();

    if (!isConnected) {
        return (
            <div className="flex flex-row gap-[2px]">
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">connecting</p>
            </div>
        );
    }
};
