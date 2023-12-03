'use client';

import { cn } from '@/shared/utils/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

interface props {
    label: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    children: ReactNode;
    className?: string;
}

export const ActionTooltip = ({ label, side, align, children, className }: props) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                    className={cn(className, 'hidden md:block')}
                >
                    <p className="font-semibold text-sm capitalize">{label.toLowerCase()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
