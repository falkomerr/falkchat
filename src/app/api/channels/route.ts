import { currentProfile } from '@/utils/current-profile';
import { db } from '@/utils/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!serverId) {
            return new NextResponse('Server ID missing', { status: 400 });
        }

        if (name === 'general') {
            return new NextResponse('Name cannot be "general"', { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.MODERATOR, MemberRole.ADMIN],
                        },
                    },
                },
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name: name,
                        type: type,
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.error('CHANNELS_POST_ERROR', error);
        return new NextResponse('Interntal Error', { status: 500 });
    }
}

