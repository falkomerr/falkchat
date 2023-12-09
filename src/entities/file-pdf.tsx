import React from 'react';
import { FileIcon } from 'lucide-react';

interface props {
    fileUrl: string;
    label?: string;
}

export const FilePdf = ({ fileUrl, label = 'PDF File' }: props) => {
    return (
        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 mx-4">
            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400 pointer" />
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
                {label}
            </a>
        </div>
    );
};
