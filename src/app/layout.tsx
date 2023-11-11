import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/components/utils/utils';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const poppins = Poppins({
    subsets: ['latin'],
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
                <body className={cn(poppins.className, 'bg-white dark:bg-[#313338]')}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        storageKey="falkchat-theme">
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
