'use client';

import { CreateChannelModal } from '@/components/modals/create-channel-modal';
import { CreateServerModal } from '@/components/modals/create-server-modal';
import { DeleteChannel } from '@/components/modals/delete-channel-modal';
import { DeleteServer } from '@/components/modals/delete-server';
import { EditChannelModal } from '@/components/modals/edit-channel-modal';
import { EditServerModal } from '@/components/modals/edit-server-modal';
import { InviteModal } from '@/components/modals/invite-modal';
import { LeaveServer } from '@/components/modals/leave-modal';
import { ManageUsers } from '@/components/modals/users-modal';
import { useEffect, useState } from 'react';

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <>
            <>
                <CreateServerModal />
                <DeleteServer />
                <LeaveServer />
            </>
            <>
                <ManageUsers />
                <EditServerModal />
                <InviteModal />
            </>
            <>
                <CreateChannelModal />
                <DeleteChannel />
                <EditChannelModal />
            </>
        </>
    );
};

export default ModalProvider;
