import { Skeleton } from '@/shared/ui/skeleton';
import '@uploadthing/react/styles.css';
import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { generateComponents } from '@uploadthing/react';

interface props {
    onChange: (url?: string) => void;
    value: string;
    endpoint: 'messageFile' | 'serverImage';
}

export const FileUpload = ({ onChange, value, endpoint }: props) => {
    const { UploadDropzone } = generateComponents<OurFileRouter>();
    const [isLoaded, setIsLoaded] = useState(false);
    const fileType = value.split('.').pop();

    if (value && fileType !== 'pdf') {
        return (
            <div className="relative h-20 w-20">
                {!isLoaded && <Skeleton className="w-full h-full rounded-full bg-gray-400" />}
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                    onLoad={() => setIsLoaded(false)}
                />

                <button
                    onClick={() => onChange('')}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm "
                    type="button">
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    if (value && fileType === 'pdf') {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 mx-4">
                <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 mx-4">
                    <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400 pointer" />
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
                        PDF File
                    </a>
                </div>
                <button
                    onClick={() => onChange('')}
                    className="bg-rose-500 text-white p-1 -top-2 -right-2 rounded-full absolute shadow-sm "
                    type="button">
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(response) => onChange(response?.[0].url)}
            onUploadError={(error: Error) => {
                console.error(error);
            }}
        />
    );
};
