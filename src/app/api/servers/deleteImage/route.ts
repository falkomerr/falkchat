import { currentProfile } from '@/shared/utils/lib/current-profile';
import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const imageId = imageUrl.split('/').pop();

        const utapi = new UTApi();
        await utapi.deleteFiles(imageId);

        return new NextResponse('Succesfull', { status: 200 });
    } catch (error) {
        console.error('[SERVERS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
