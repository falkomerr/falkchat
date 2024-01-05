import { NextApiResponseServerIO } from '@/shared/types';
import { NextApiRequest } from 'next';
import { db, pagesCurrentProfile } from '@/shared/api-functions';
import { MemberRole } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'DELETE' && req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const profile = await pagesCurrentProfile(req);
        const { messageId, serverId, channelId } = req.query;
        const { content } = req.body;

        if (!profile) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!serverId) {
            return res.status(400).json({ error: 'Server ID Missing' });
        }

        if (!channelId) {
            return res.status(400).json({ error: 'Channel ID Missing' });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        if (!server) {
            return res.status(404).json({ error: 'Server not found' });
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });

        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        const member = server.members.find((member) => profile.id === member.profileId);

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!message || message.deleted) {
            return res.status(404).json({ error: 'Message not found' });
        }

        const isMessageOwner = message.member.profileId === profile.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isModerator || isMessageOwner || isAdmin;

        if (!canModify) {
            return res.status(403).json({ error: 'Cannot modify message' });
        }

        if (req.method === 'DELETE') {
            message = await db.message.update({
                where: {
                    id: messageId as string,
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
                return res.status(403).json({ error: 'Only owner of message can modify it' });
            }
            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    content: content,
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

        const updateKey = `chat:${channelId}:message:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.error('[MESSAGE_ID]', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
}
