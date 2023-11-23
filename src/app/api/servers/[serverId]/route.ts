import { currentProfile } from '@/utils/current-profile';
import { db } from '@/utils/db';
import { NextResponse } from 'next/server';

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

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.error('[SERVER_ID]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
