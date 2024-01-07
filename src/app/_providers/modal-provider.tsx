'use client';

import { InitialModal } from '@/pages/setup/ui/initial-modal';
import { CreateChannelModal, DeleteChannelModal } from '@/widgets/channel';
import { MessageAttachmentModal } from '@/widgets/chat';
import {
    DeleteMessageModal,
    InviteModal,
    LeaveServerModal,
    ManageUsersModal,
} from '@/widgets/modals';
import { CreateServerModal, DeleteServerModal, EditServerModal } from '@/widgets/server';
import { useEffect, useState } from 'react';

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <InviteModal />
            <InitialModal />
            <EditServerModal />
            <CreateServerModal />
            <CreateChannelModal />
            <DeleteChannelModal />
            <DeleteServerModal />
            <ManageUsersModal />
            <LeaveServerModal />
            <DeleteMessageModal />
            <MessageAttachmentModal />
        </>
    );
};
