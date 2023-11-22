'use client';

import { CreateServerModal } from '@/components/modals/create-server-modal';
import { EditServerModal } from '@/components/modals/edit-server-modal';
import { InviteModal } from '@/components/modals/invite-modal';
import { useEffect, useState } from 'react';
import { ManageUsers } from '@/components/modals/users-modal';

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
            <EditServerModal />
            <ManageUsers />
            <CreateServerModal />
            <InviteModal />
        </>
    );
};

export default ModalProvider;
