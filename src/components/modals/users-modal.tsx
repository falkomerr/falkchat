'use client';

import {
    Check,
    Gavel,
    Loader2,
    MoreVertical,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import qs from 'query-string';

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const ManageUsers = () => {
    const router = useRouter();
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState('');

    const isModalOpen = isOpen && type === 'users';
    const { server } = data as { server: ServerWithMembersWithProfiles };

    const onChangeRole = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                    memberId: memberId,
                },
            });

            const response = await axios.patch(url, { role });
            router.refresh();
            onOpen('users', { server: response.data });
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId('');
        }
    };

    const onMemberKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);

            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            });

            const response = await axios.delete(url);

            router.refresh();
            onOpen('users', { server: response.data });
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId('');
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Your server has {server?.members?.length} members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar source={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">{member.profile.email}</p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="outline-none">
                                            <MoreVertical className="h-4 w-4 text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center">
                                                    <ShieldQuestion className="w-4 h-4 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onChangeRole(member.id, 'GUEST')
                                                            }>
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Guest
                                                            {member.role === 'GUEST' && (
                                                                <Check className="h-4 w-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onChangeRole(member.id, 'MODERATOR')
                                                            }>
                                                            <ShieldCheck className="h-4 w-4 mr-2" />
                                                            Moderator
                                                            {member.role === 'MODERATOR' && (
                                                                <Check className="h-4 w-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onMemberKick(member.id)}>
                                                <Gavel className="h-4 w-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
