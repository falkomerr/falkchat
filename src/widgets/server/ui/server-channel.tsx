'use client';

import { ModalType, useModal } from '@/shared/use-modal';
import { ActionTooltip } from '@/shared/ui/action-tooltip';
import { cn } from '@/shared/tailwind-merge/utils';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface props {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({ channel, server, role }: props) => {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();
    const Icon = iconMap[channel.type];

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
    };

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { channel, server });
    };

    return (
        <button
            onClick={() => onClick()}
            className={cn(
                'relative group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
                params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700',
            )}>
            <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            <p
                className={cn(
                    'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
                    params?.channelId === channel.id &&
                        'text-primary dark:text-zinc-200 dark:group-hover:text-white',
                )}>
                {channel.name}
            </p>
            {channel.name !== 'general' && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2 ">
                    <ActionTooltip label="Edit">
                        <Edit
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                            onClick={(event) => onAction(event, 'editChannel')}
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                            onClick={(event) => onAction(event, 'deleteChannel')}
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === 'general' && (
                <Lock className="hidden group-hover:block ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            )}
        </button>
    );
};
