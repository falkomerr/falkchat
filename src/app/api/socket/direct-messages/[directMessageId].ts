import { NextApiResponseServerIO } from '@/shared/types';
import { db, pagesCurrentProfile } from '@/shared/api-functions';
import { MemberRole } from '@prisma/client';
import { NextApiRequest } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'DELETE' && req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const profile = await pagesCurrentProfile(req);
        const { directMessageId, conversationId } = req.query;
        const { content } = req.body;

        if (!profile) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID missing' });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        firstMember: {
                            profileId: profile.id,
                        },
                    },
                    {
                        secondMember: {
                            profileId: profile.id,
                        },
                    },
                ],
            },
            include: {
                firstMember: {
                    include: {
                        profile: true,
                    },
                },
                secondMember: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const member =
            conversation.firstMember.profileId === profile.id
                ? conversation.firstMember
                : conversation.secondMember;

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!directMessage || directMessage.deleted) {
            return res.status(404).json({ error: 'Message not found' });
        }

        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (req.method === 'DELETE') {
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    fileUrl: null,
                    content: 'This message has been deleted.',
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }

        if (req.method === 'PATCH') {
            if (!isMessageOwner) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }

        const updateKey = `chat:${conversation.id}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, directMessage);

        return res.status(200).json(directMessage);
    } catch (error) {
        console.log('[MESSAGE_ID]', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
}
