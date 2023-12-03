import { Avatar, AvatarImage } from '@/shared/ui/avatar';
import { cn } from '@/shared/utils/lib/utils';

interface props {
    source?: string;
    className?: string;
}

export const UserAvatar = ({ source, className }: props) => {
    return (
        <>
            <Avatar className={cn('h-7 w-7 md:h-10 md:w-10 select-none', className)}>
                <AvatarImage src={source} />
            </Avatar>
        </>
    );
};
