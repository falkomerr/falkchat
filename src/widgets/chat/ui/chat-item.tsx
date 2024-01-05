'use client';

import { MessageContent, MessageEditForm, MessageOptions } from '@/entities/message';
import { ActionTooltip } from '@/shared/ui/action-tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { Member, Profile } from '@prisma/client';
import axios from 'axios';
import { FileIcon, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';
import { Skeleton } from '@/shared/ui/skeleton';
import NextImage from 'next/image';

interface props {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
}: props) => {
    const [isLoadingImage, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content,
        },
    });

    useEffect(() => {
        form.reset({
            content: content,
        });
    }, [content]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsEditing(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const fileType = fileUrl?.split('.').pop();

    const isAdmin = currentMember.role === 'ADMIN';
    const isModerator = currentMember.role === 'ADMIN';
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === 'pdf' && fileUrl;
    const isImage = !isPDF && fileUrl;

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });

            await axios.patch(url, values);

            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };
    const params = useParams();
    const router = useRouter();

    const onMemberClick = () => {
        if (member.id === currentMember.id) {
            return;
        }

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    };

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div
                    className="cursor-pointer hover:drop-shadow-md transition"
                    onClick={onMemberClick}>
                    <Avatar className={'h-7 w-7 md:h-10 md:w-10 select-none'}>
                        <AvatarImage src={member.profile.imageUrl} />
                    </Avatar>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p
                                className="font-semibold text-sm hover:underline cursor-pointer"
                                onClick={onMemberClick}>
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48">
                            {isLoadingImage && <Skeleton className="h-full w-full bg-gray-400" />}
                            <NextImage
                                src={fileUrl}
                                fill
                                alt={content}
                                className="object-cover"
                                placeholder="blur"
                                onLoad={() => setIsLoading(true)}
                            />
                        </a>
                    )}
                    {isPDF && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 mx-4">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400 pointer" />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
                                PDF File
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <MessageContent content={content} deleted={deleted} isUpdated={isUpdated} />
                    )}
                    {!fileUrl && isEditing && (
                        <MessageEditForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
                    )}
                </div>
            </div>
            <MessageOptions
                canEditMessage={canEditMessage}
                canDeleteMessage={canDeleteMessage}
                setIsEditing={setIsEditing}
                modalData={{ apiUrl: `${socketUrl}/${id}`, query: socketQuery }}
            />
        </div>
    );
};
