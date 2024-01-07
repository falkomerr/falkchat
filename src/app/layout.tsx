import { ModalProvider, QueryProvider, SocketProvider, ThemeProvider } from '@/app/_providers';
import { cn } from '@/shared/tailwind-merge/';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
    subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export const metadata: Metadata = {
    title: 'FalkChat',
    description:
        'FalkChat is your go-to destination for seamless and engaging online conversations. Whether you want to connect with friends, meet new people, or discuss your favorite topics, FalkChat offers a versatile and user-friendly platform to make it happen.',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 0,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
            }}>
            <html lang="en" suppressHydrationWarning>
                <body className={cn(inter.className, 'bg-white dark:bg-[#151315]')}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        storageKey="falkchat-theme">
                        <SocketProvider>
                            <ModalProvider />
                            <QueryProvider>{children}</QueryProvider>
                            <Analytics />
                            <SpeedInsights />
                        </SocketProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
