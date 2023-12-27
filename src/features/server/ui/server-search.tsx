'use client';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/shared/ui/command';
import { Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface props {
    data: {
        label: string;
        type: 'channel' | 'member';
        data:
            | {
                  icon: ReactNode;
                  name: string;
                  id: string;
              }[]
            | undefined;
    }[];
}

export const ServerSearch = ({ data }: props) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        document.addEventListener('keydown', down);

        return () => {
            document.removeEventListener('keydown', down);
        };
    }, []);

    const onClick = (id: string, type: 'channel' | 'member') => {
        setOpen(false);

        if (type === 'member') {
            router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }

        if (type === 'channel') {
            router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    Search
                </p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                    <span className="text-xs">CTRL + K</span>
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search channels and members" />
                <CommandList>
                    <CommandEmpty>No Results found</CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({ id, icon, name }) => (
                                    <CommandItem onSelect={() => onClick(id, type)} key={id}>
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        );
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
};
