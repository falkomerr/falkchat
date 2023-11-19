import { ModeToggle } from '@/components/mode-toggle';
import { NavigationAction } from '@/components/navigation/navigation-action';
import { NavigationItem } from '@/components/navigation/navigation-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { currentProfile } from '@/utils/current-profile';
import { db } from '@/utils/db';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export const NavigationSidebar = async ({}) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect('/');
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary dark:bg-[#1E1F22] py-3 w-full">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => {
                    return (
                        <div key={server.id} className="mb-4">
                            <NavigationItem
                                name={server.name}
                                imageUrl={server.imageUrl}
                                id={server.id}
                            />
                        </div>
                    );
                })}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: 'h-[48px] w-[48px]',
                        },
                    }}
                />
            </div>
        </div>
    );
};
