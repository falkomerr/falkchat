import { Member } from '@prisma/client';

export function conditions(
    fileUrl: string | null,
    currentMember: Member,
    deleted: boolean,
    member: Member,
) {
    const fileType = fileUrl?.split('.').pop();

    const isAdmin = currentMember.role === 'ADMIN';
    const isModerator = currentMember.role === 'ADMIN';
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === 'pdf' && fileUrl;
    const isImage = !isPDF && fileUrl;

    return {
        canDeleteMessage,
        canEditMessage,
        isPDF,
        isImage,
    };
}
