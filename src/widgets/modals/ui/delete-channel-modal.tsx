'use client';

import { useModal } from '@/shared/hooks/lib/use-modal-store';
import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useState } from 'react';

export const DeleteChannelModal = ({}) => {
    const { isOpen, type, onClose, data } = useModal();

    const router = useRouter();

    const { server, channel } = data;

    const [loading, setLoading] = useState<boolean>(false);

    const isModalOpen = isOpen && type == 'deleteChannel';

    const onCancel = () => {
        onClose();
    };

    const onConfirm = async () => {
        try {
            setLoading(true);

            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            });

            await axios.delete(url);
            router.refresh();
            router.push(`/servers/${server?.id}`);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 ">
                        Do you really want to do this? The {channel?.type.toLowerCase()}
                        -channel{' '}
                        <span className="text-indigo-500 font-semibold  ">
                            #{channel?.name}
                        </span>{' '}
                        will be permamently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={loading}
                            onClick={onCancel}
                            variant="ghost"
                            className="outline-none"
                        >
                            Cancel
                        </Button>
                        <Button disabled={loading} onClick={onConfirm} variant="destructive">
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
