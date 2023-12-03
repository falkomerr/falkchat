import ModalProvider from '@/components/providers/modal-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/utils/utils';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { ReactNode } from 'react';
import './globals.css';

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

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
            }}>
            <html lang="en" suppressHydrationWarning>
                <Head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                    />
                </Head>
                <body className={cn(inter.className, 'bg-white dark:bg-[#151315]')}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        storageKey="falkchat-theme">
                        <SocketProvider>
                            <ModalProvider />
                            {children}
                            <Analytics />
                        </SocketProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
