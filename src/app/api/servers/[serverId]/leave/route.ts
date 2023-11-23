import { currentProfile } from '@/utils/current-profile';
import { db } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse('Server ID Missing', { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id,
                },
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id,
                    },
                },
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
        console.error('[SERVER_LEAVE_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
