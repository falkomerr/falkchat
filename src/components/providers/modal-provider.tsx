'use client';

import * as Modals from '@/components/modals';
import { useEffect, useState } from 'react';

type ModalKey = keyof typeof Modals;

const modalKeys: ModalKey[] = Object.keys(Modals) as ModalKey[];

function createModalGroups(modalKeys: ModalKey[]): React.ComponentType[] {
    const groups: React.ComponentType[][] = [];
    let currentGroup: React.ComponentType[] = [];

    modalKeys.sort().forEach((modalKey, index) => {
        currentGroup.push(Modals[modalKey]);

        if ((index + 1) % 3 === 0 || index === modalKeys.length - 1) {
            groups.push(currentGroup);
            currentGroup = [];
        }
    });

    return groups.flat();
}

const modalGroups: React.ComponentType[] = createModalGroups(modalKeys);

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
            {modalGroups.map((Modal, index) => (
                <div key={index}>
                    <Modal />
                </div>
            ))}
        </>
    );
};

export default ModalProvider;
