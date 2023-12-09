import React, { useEffect, useState } from 'react';
import { Member, Profile } from '@prisma/client';
import { UserAvatar } from '@/entities/user-avatar';
import { ActionTooltip } from '@/entities/action-tooltip';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { FilePdf } from '@/entities/file-pdf';
import { FileImage } from '@/entities/file-image';
import * as z from 'zod';
import { MessageContent } from '@/entities/message-content';
import { MessageOptions } from '@/entities/message-options';
import { useForm } from 'react-hook-form';
import qs from 'query-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageEditForm } from '@/entities/message-edit-form';
import axios from 'axios';

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

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar source={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
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
                    {isImage && <FileImage fileUrl={fileUrl} content={content} />}
                    {isPDF && <FilePdf fileUrl={fileUrl} />}
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
