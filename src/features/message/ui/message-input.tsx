'use client';

import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useModal } from '@/shared/use-modal';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus, Smile } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface props {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: 'conversation' | 'channel';
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const MessageInput = ({ apiUrl, query, name, type }: props) => {
    const { resolvedTheme } = useTheme();

    const { onOpen } = useModal();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: '',
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query: query,
            });

            await axios.post(url, data);
            form.reset();
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            await onSubmit({ content: (event.target as HTMLInputElement).value });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                <Input autoComplete="false" hidden className="hidden px-12 py-6" />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onOpen('messageAttachment', {
                                                apiUrl,
                                                query,
                                            })
                                        }
                                        className="absolute top-7 left-7 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center">
                                        <Plus className="text-white dark:text-[#313338]" />
                                    </button>
                                    <Input
                                        onInput={(event) => event.stopPropagation()}
                                        onKeyDown={(event) => handleKeyDown(event)}
                                        disabled={isLoading}
                                        className="px-12 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                        {...field}
                                        placeholder={`Message ${
                                            type === 'conversation' ? name : `#` + name
                                        }`}
                                    />
                                    <div className="absolute top-7 right-7">
                                        <Popover>
                                            <PopoverTrigger>
                                                <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                                            </PopoverTrigger>
                                            <PopoverContent
                                                side="right"
                                                sideOffset={40}
                                                className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
                                                <Picker
                                                    data={data}
                                                    theme={resolvedTheme}
                                                    onEmojiSelect={(emoji: string) =>
                                                        field.onChange(`${field.value}${emoji}`)
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};
