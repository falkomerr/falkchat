import React, { Dispatch, SetStateAction } from 'react';
import { ActionTooltip } from '@/entities/action-tooltip';
import { Edit, Trash } from 'lucide-react';
import { useModal } from '@/shared/hooks';

interface props {
    canEditMessage: boolean;
    canDeleteMessage: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    modalData: { apiUrl: string; query: Record<string, string> };
}

export const MessageOptions = ({
    canEditMessage,
    canDeleteMessage,
    setIsEditing,
    modalData,
}: props) => {
    const { onOpen } = useModal();

    if (canDeleteMessage) {
        return (
            <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 right-5 bg-white dark:bg-zinc-800 border rounded-sm -top-2">
                {canEditMessage && (
                    <ActionTooltip label="Edit">
                        <Edit
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                )}
                <ActionTooltip label="Delete">
                    <Trash
                        onClick={() => onOpen('deleteMessage', modalData)}
                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                    />
                </ActionTooltip>
            </div>
        );
    }
};
