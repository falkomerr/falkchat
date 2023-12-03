import { db } from '@/shared/utils/lib/db';
import { initialProfile } from '@/shared/utils/lib/initial-profile';
import { InitialModal } from '@/widgets/modals/ui/initial-modal';
import { redirect } from 'next/navigation';

const SetupPage = async ({}) => {
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
