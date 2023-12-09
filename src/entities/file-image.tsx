import React, { useState } from 'react';
import { Skeleton } from '@/shared/ui/skeleton';
import NextImage from 'next/image';

interface props {
    fileUrl: string;
    content: string;
}

export const FileImage = ({ fileUrl, content }: props) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48">
            {isLoading && <Skeleton className="h-full w-full bg-gray-400" />}
            <NextImage
                src={fileUrl}
                fill
                alt={content}
                className="object-cover"
                placeholder="blur"
                onLoad={() => setIsLoading(true)}
            />
        </a>
    );
};
