import { currentProfile } from '@/utils/current-profile';
import { db } from '@/utils/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface props {
    params: {
        serverId: string;
    };
}

const ServerIdPage = async ({ params }: props) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
        include: {
            channels: {
                where: {
                    name: 'general',
                },
            },
        },
    });

    const generalChannel = server?.channels[0];

    if (generalChannel?.name !== 'general') {
        return null;
    }

    return redirect(`/servers/${server?.id}/channels/${generalChannel?.id}`);
};
export default ServerIdPage;
