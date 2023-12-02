import { BurgerMenu } from '@/components/mobile-toggle';
import { UserAvatar } from '@/components/user-avatar';
import { UserButton } from '@clerk/nextjs';
import { Hash } from 'lucide-react';
import { SocketIndicator } from '@/components/socket-indicatior';

interface props {
    serverId: string;
    name: string;
    type: 'channel' | 'conversation';
    imageUrl?: string;
}

export const ChatHeader = ({ serverId, name, type, imageUrl }: props) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 justify-between flex-row">
            <div className="flex flex-row items-center">
                <BurgerMenu serverId={serverId} />
                {type === 'channel' && (
                    <>
                        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 ml-4" />
                        <p className="font-semibold text-md text-black dark:text-white">{name}</p>
                    </>
                )}
                {type === 'conversation' && (
                    <>
                        <UserAvatar
                            source={imageUrl}
                            className="hidden md:block md:h-8 md:w-8 ml-2"
                        />
                        <p className="font-semibold text-md mx-2 text-black dark:text-white">
                            {name}
                        </p>
                        <SocketIndicator />
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
