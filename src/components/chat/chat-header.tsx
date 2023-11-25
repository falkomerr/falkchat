import { BurgerMenu } from '@/components/mobile-toggle';
import { Hash } from 'lucide-react';

interface props {
    serverId: string;
    name: string;
    type: 'channel' | 'conversation';
    imageUrl?: string;
}

export const ChatHeader = ({ serverId, name, type, imageUrl }: props) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <BurgerMenu serverId={serverId} />
            {type === 'channel' && (
                <>
                    <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 ml-4" />
                    <p className="font-semibold text-md text-black dark:text-white">{name}</p>
                </>
            )}
        </div>
    );
};
