import { NavigationItem } from './navigation-item';
import { ModeToggle } from '@/shared/ui/mode-toggle';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { currentProfile, db } from '@/shared/api-functions';
import { redirect } from 'next/navigation';
import { ActionTooltip } from '@/shared/ui/action-tooltip';
import { Plus } from 'lucide-react';
import { useModal } from '@/shared/use-modal';

export const NavigationSidebar = async ({}) => {
    const { onOpen } = useModal();

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
                <div>
                    <ActionTooltip side="right" align="center" label="Add a server">
                        <button
                            className="group flex items-center outline-none "
                            onClick={() => {
                                onOpen('createServer');
                            }}>
                            <div className="flex m-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-blue-500">
                                <Plus
                                    className="group-hover:text-white transition text-blue-500"
                                    size={25}
                                />
                            </div>
                        </button>
                    </ActionTooltip>
                </div>
            </div>

            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4 z-50">
                <ModeToggle />
            </div>
        </div>
    );
};
