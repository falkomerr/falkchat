'use client';

import * as Modals from '@/widgets/modals';
import { useEffect, useState } from 'react';

type ModalKey = keyof typeof Modals;

const modalKeys: ModalKey[] = Object.keys(Modals) as ModalKey[];

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
            {modalKeys.map((modalKey, index) => {
                const Modal = Modals[modalKey];
                return (
                    <div key={index}>
                        <Modal />
                    </div>
                );
            })}
        </>
    );
};
