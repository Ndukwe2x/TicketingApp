import * as React from 'react';
import type { Metadata, GetServerSideProps } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { APPCONFIG } from '@/lib/app-config';
import { Providers } from './providers';

// const AppContext = React.createContext();
// export const AppProvider = AppContext.Provider;


const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: APPCONFIG.title,
    description: APPCONFIG.description,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body
                className={cn(inter.variable, 'min-h-screen bg-background font-sans antialiased')}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
