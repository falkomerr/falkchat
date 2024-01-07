import { useSocket } from '@/shared/socket';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';
import { BurgerMenu } from '@/shared/ui/burger-menu';
import { UserButton } from '@clerk/nextjs';
import { Hash, Loader2 } from 'lucide-react';

interface props {
    serverId: string;
    name: string;
    type: 'channel' | 'conversation';
    imageUrl?: string;
}

export const ChatHeader = ({ serverId, name, type, imageUrl }: props) => {
    const { isConnected } = useSocket();

    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 justify-between flex-row">
            <div className="flex flex-row items-center w-full">
                <BurgerMenu serverId={serverId} />
                {type === 'channel' && (
                    <>
                        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 ml-4" />
                        <p className="font-semibold text-md text-black dark:text-white ">{name}</p>
                        {!isConnected && (
                            <div className="flex flex-row gap-[2px] ml-auto">
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                    connecting
                                </p>
                            </div>
                        )}
                    </>
                )}
                {type === 'conversation' && (
                    <>
                        <Avatar
                            className={'h-7 w-7  select-none hidden md:block md:h-8 md:w-8 ml-2'}>
                            <AvatarImage src={imageUrl} />
                        </Avatar>
                        <p className="font-semibold text-md mx-2 text-black dark:text-white">
                            {name}
                        </p>

                        {!isConnected && (
                            <div className="flex flex-row gap-[2px] ml-auto">
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                    connecting
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
            <UserButton
                afterSignOutUrl="/"
                appearance={{
                    elements: {
                        avatarBox: 'h-[36px] w-[36px]',
                    },
                }}
            />
        </div>
    );
};
