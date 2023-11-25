'use client';
import { Next13ProgressBar } from 'next13-progressbar';
import React from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <Next13ProgressBar
                height="2px"
                color="#3579F8"
                options={{ showSpinner: true }}
                showOnShallow
            />
        </>
    );
};

export default Providers;
