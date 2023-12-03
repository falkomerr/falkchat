'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const LeaveServerModal = ({}) => {
    const { isOpen, type, onClose, data } = useModal();
    const router = useRouter();
    const { server } = data;

    const [loading, setLoading] = useState<boolean>(false);

    const isModalOpen = isOpen && type == 'leaveServer';

    const onCancel = () => {
        onClose();
    };

    const onConfirm = async () => {
        try {
            setLoading(true);

            const response = await axios.patch(`/api/servers/${server?.id}/leave/`);
            router.refresh();
            router.push(response.data);
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
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Do you really want to leave{' '}
                        <span className="text-indigo-500 font-semibold">{server?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={loading}
                            onClick={onCancel}
                            variant="ghost"
                            className="outline-none">
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
