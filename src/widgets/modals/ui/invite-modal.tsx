'use client';

import { useModal, useOrigin } from '@/shared/hooks';
import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import axios from 'axios';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export const InviteModal = ({}) => {
    const { isOpen, type, onClose, data, onOpen } = useModal();
    const origin = useOrigin();

    const { server } = data;

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const [copied, setCopied] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen('invite', { server: response.data });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isModalOpen = isOpen && type == 'invite';

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite friends
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Invite your friends to your server!
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 ">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={loading}
                            readOnly
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button disabled={loading} size="icon" onClick={onCopy}>
                            {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={loading}
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4">
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
