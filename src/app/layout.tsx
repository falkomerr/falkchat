import ModalProvider from '@/components/providers/modal-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/utils/utils';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';
import Providers from './providers';

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
                <body className={cn(inter.className, 'bg-white dark:bg-[#151315]')}>
                    <Providers>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem={false}
                            storageKey="falkchat-theme">
                            <ModalProvider />
                            {children}
                            <Analytics />
                        </ThemeProvider>
                    </Providers>
                </body>
            </html>
        </ClerkProvider>
    );
}
