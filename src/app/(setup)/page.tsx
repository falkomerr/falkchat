import { InitialModal } from '@/components/modals/initial-modal';
import { db } from '@/utils/db';
import { initialProfile } from '@/utils/initial-profile';
import { NextPage } from 'next';
import { redirect } from 'next/navigation';

const SetupPage: NextPage = async ({}) => {
    const profile = await initialProfile();

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return (
        <>
            <InitialModal />
        </>
    );
};
export default SetupPage;
