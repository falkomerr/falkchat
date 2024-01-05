import { db, initialProfile } from '@/shared/api-functions';
import { InitialModal } from './initial-modal';
import { redirect } from 'next/navigation';

export const SetupPage = async ({}) => {
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
