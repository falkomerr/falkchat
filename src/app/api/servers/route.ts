import { currentProfile } from '@/utils/current-profile';
import { db } from '@/utils/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (imageUrl) {
            const server = await db.server.findFirst({
                where: {
                    imageUrl: imageUrl,
                },
            });

            const imageId = server?.imageUrl.split('/').pop();

            const utapi = new UTApi();
            imageId && (await utapi.deleteFiles(imageId));
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name: name,
                imageUrl: imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {
                            name: 'general',
                            profileId: profile.id,
                        },
                    ],
                },
                members: {
                    create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.error('[SERVERS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
