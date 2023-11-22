import { currentProfile } from '@/utils/current-profile';
import { db } from '@/utils/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface props {
    params: {
        inviteCode: string;
    };
}

const InviteCodePage = async ({ params }: props) => {
    const profile = await currentProfile();
    console.log(params.inviteCode);

    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect('/');
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    },
                ],
            },
        },
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return <div>wkdwdwk</div>;
};

export default InviteCodePage;
