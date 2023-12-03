import { ModeToggle } from '@/entities/mode-toggle';
import { NavigationCreate } from '@/entities/navigation-create';
import { NavigationItem } from '@/entities/navigation-item';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { currentProfile } from '@/shared/utils/lib/current-profile';
import { db } from '@/shared/utils/lib/db';
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
        <div className="space-y-4 flex flex-col items-center h-full text-primary bg-[#E3E5E8] dark:bg-[#1E1F22] py-3 w-full justify-between">
            <div className="flex flex-col gap-3">
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
                <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
                <NavigationCreate />
            </div>

            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4 z-50">
                <ModeToggle />
            </div>
        </div>
    );
};
