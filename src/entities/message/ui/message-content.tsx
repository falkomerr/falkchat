import React from 'react';
import { cn } from '@/shared/tailwind-merge';

interface props {
    content: string;
    deleted: boolean;
    isUpdated: boolean;
}

export const MessageContent = ({ content, deleted, isUpdated }: props) => {
    return (
        <p
            className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1',
            )}>
            {content}
            {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
            )}
        </p>
    );
};
