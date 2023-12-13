import { NextApiResponseServerIO } from '@/shared/types';
import { db, pagesCurrentProfile } from '@/shared/utils';
import { NextApiRequest } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const profile = await pagesCurrentProfile(req);
        const { content, fileUrl } = req.body;
        const { conversationId } = req.query;

        if (!profile) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID missing' });
        }

        if (!content) {
            return res.status(400).json({ error: 'Content missing' });
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
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const member =
            conversation.firstMember.profileId === profile.id
                ? conversation.firstMember
                : conversation.secondMember;

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log('[DIRECT_MESSAGES_POST]', error);
        return res.status(500).json({ message: 'Internal Error' });
    }
}
