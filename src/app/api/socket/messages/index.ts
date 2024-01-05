import { pagesCurrentProfile } from '@/shared/api-functions';
import { db } from '@/shared/api-functions/db';
import { NextApiResponseServerIO } from '@/shared/types';
import { NextApiRequest } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method now allowed' });
    }
    try {
        const profile = await pagesCurrentProfile(req);
        const { serverId, channelId } = req.query;
        const { content, fileUrl } = req.body;

        if (!profile) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!serverId) {
            return res.status(40).json({ error: 'Server ID Missing' });
        }

        if (!channelId) {
            return res.status(400).json({ error: 'Channel ID Missing' });
        }

        if (!content) {
            return res.status(400).json({ error: 'Content Missing' });
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
            return res.status(404).json({ message: 'Server Not Found' });
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });

        if (!channel) {
            return res.status(404).json({ message: 'Channel Not Found' });
        }

        const member = server.members.find((member) => member.profileId === profile.id);

        if (!member) {
            return res.status(403).json({ message: 'You cannot access this server' });
        }

        const message = await db.message.create({
            data: {
                content: content,
                fileUrl: fileUrl,
                channelId: channelId as string,
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

        const key = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(key, message);

        return res.status(200).json(message);
    } catch (error) {
        console.error('[MESSAGES_POST]', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
}
