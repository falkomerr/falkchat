import { currentProfile } from '@/shared/api-functions';
import { db } from '@/shared/api-functions/db';
import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name: name,
                imageUrl: imageUrl,
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.error('[SERVER_ID]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse('Server ID Missing', { status: 400 });
        }

        const server = await db.server.findFirst({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
        });
        const imageId = server?.imageUrl.split('/').pop() as string;

        const utapi = new UTApi();
        await utapi.deleteFiles(imageId);

        await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
        });
        const firstServer = await db.server.findFirst({
            where: {
                id: {
                    not: params.serverId,
                },
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
        });
        if (firstServer) {
            return NextResponse.json(`/servers/${firstServer.id}`);
        }
        return NextResponse.json(`/`);
    } catch (error) {
        console.error('[SERVER_ID]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
