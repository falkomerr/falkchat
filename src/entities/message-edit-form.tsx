import React from 'react';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Button } from '@/shared/ui/button';

interface props {
    form: UseFormReturn<{ content: string }>;
    onSubmit: SubmitHandler<{ content: string }>;
    isLoading: boolean;
}

export const MessageEditForm = ({ form, onSubmit, isLoading }: props) => {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-start w-full gap-x-2 pt-2 flex-col"
            >
                <div className="flex items-center w-full gap-x-2">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <div className="relative w-full">
                                        <Input
                                            disabled={isLoading}
                                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                            placeholder="Edited message"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button size="sm" variant="primary" disabled={isLoading}>
                        Save
                    </Button>
                </div>

                <span className="text-[10px] mt-1 text-zinc-400">
                    Press ESC to cancel, ENTER to save
                </span>
            </form>
        </Form>
    );
};
