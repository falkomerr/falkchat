import { ServerSidebar } from '@/components/server/server-sidebar';
import { currentProfile } from '@/utils/current-profile';
import { db } from '@/utils/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const ServerIdLayout = async ({
    children,
    params,
}: {
    children: ReactNode;
    params: { serverId: string };
}) => {
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
    });

    if (!server) {
        return redirect('/');
    }
    return (
        <div className="h-full">
            <div className="fixed hidden md:flex h-full w-60 z-20 flex-col inset-y-0">
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className="h-full md:pl-60">{children}</main>
        </div>
    );
};

export default ServerIdLayout;
