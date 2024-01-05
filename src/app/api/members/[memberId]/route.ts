import { currentProfile, db } from '@/shared/api-functions';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get('serverId');

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!serverId) {
            return new NextResponse('Server ID missing', { status: 400 });
        }

        if (!params.memberId) {
            return new NextResponse('Member ID missing', { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc',
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log('[MEMBER_DELETE_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const { role } = await req.json();
        const serverId = searchParams.get('serverId');

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!serverId) {
            return new NextResponse('Server ID Missing', { status: 400 });
        }

        if (!params.memberId) {
            return new NextResponse('Member ID Missing', { status: 400 });
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id,
                            },
                        },
                        data: {
                            role: role,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc',
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.error('[MEMBER_ROLE_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
