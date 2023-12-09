import { Channel, ChannelType, Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalType =
    | 'createServer'
    | 'invite'
    | 'editServer'
    | 'users'
    | 'createChannel'
    | 'leaveServer'
    | 'deleteServer'
    | 'deleteChannel'
    | 'editChannel'
    | 'messageAttachment'
    | 'deleteMessage';

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    data: ModalData;

    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

interface ModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    onOpen: (type, data = {}) => {
        set({ isOpen: true, type, data });
    },
    onClose: () => set({ type: null, isOpen: false }),
}));
