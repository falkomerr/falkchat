'use client';

import { useModal } from '@/shared/use-modal';
import { ServerWithMembersWithProfiles } from '@/shared/types';
import { ActionTooltip } from '@/shared/ui/action-tooltip';
import { ChannelType, MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';

interface props {
    label: string;
    role?: MemberRole;
    sectionType: 'channels' | 'members';
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({ label, role, sectionType, channelType, server }: props) => {
    const { onOpen } = useModal();
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === 'channels' && (
                <ActionTooltip label="Create Channel" side="top">
                    <button
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        onClick={() => onOpen('createChannel')}>
                        <Plus className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === 'members' && (
                <ActionTooltip label="" side="top">
                    <button
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        onClick={() => onOpen('users', { server })}>
                        <Settings className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
};
