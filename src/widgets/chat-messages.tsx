'use client';

import React, { Fragment } from 'react';
import { Member } from '@prisma/client';
import { ChatWelcome } from '@/features/chat-welcome';
import { format } from 'date-fns';
import { useChatQuery } from '@/shared/hooks';
import { Loader2, ServerCrash } from 'lucide-react';
import { MessageWithMemberWithProfile } from '@/shared/types';
import { ChatItem } from '@/features/chat-item';

interface props {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: 'channelId' | 'conversationId';
    paramValue: string;
    type: 'channel' | 'conversation';
}

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramValue,
    paramKey,
    type,
}: props) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey: `chat:${chatId}`,
        apiUrl,
        paramKey,
        paramValue,
    });

    if (status === 'pending') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500  my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome type={type} name={name} />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, index) => (
                    <Fragment key={index}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                content={message.content}
                                member={message.member}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                currentMember={member}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};
