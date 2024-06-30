"use client";

import { cn } from '@/lib/utils';
import { MainNav } from '@/components/main-nav';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { APPCONFIG } from '@/lib/app-config';
import { Text } from '@/components/ui/text';
import { AppLogo } from '@/components/app-logo';
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Session } from '@/lib/session';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import UserClass from '@/lib/User.class';
import NoNetwork from '@/components/no-network';
import TitleProvider from './title-provider';
import { useTitle } from '@/hooks/useTitleContext';
import PageHeader from '@/components/dashboard/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // const route = usePathname();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    const actor = useAuthenticatedUser();
    const [client, setClient] = useState<any>(null);
    const initialRenderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (navigator) {
            setClient(navigator);
        }
        if (!actor || !navigator.onLine) {
            return;
        }
        // Validate the user session every 10 minutes to ensure that they still have a valid token;
        Session.validateSession(actor as AppUser, 10);
    }, [actor]);

    return (
        <TitleProvider>
            <div ref={initialRenderRef} className={cn('relative min-h-screen flex flex-col justify-between')}>
                <MainNav id="app-header" />
                <div className='bg-secondary flex flex-1 flex-col md:py-16 py-8 w-full'>
                    <div className='flex relative '>
                        <DashboardNav />
                        <main id="main" className='flex-1 overflow-y-auto lg:px-10 lg:py-10'>
                            {
                                initialRenderRef.current !== null ? (
                                    client && !client.onLine ? (
                                        <div className='text-center w-full py-9'><NoNetwork /></div>
                                    ) : (
                                        <React.Fragment>
                                            <PageHeader />
                                            {children}
                                        </React.Fragment>
                                    )
                                ) : (
                                    // <div style={{ zIndex: '1020' }} className='bg-primary bottom-0 fixed flex flex-col items-center justify-center left-0 right-0 text-2xl text-white top-0'>
                                    <div className='flex flex-col items-center justify-center text-2xl text-muted-foreground pt-[10%]'>
                                        <Icons.spinner className='h-10 w-10 animate-spin' />
                                        <span>Loading...</span>
                                    </div>
                                )
                            }

                        </main>
                    </div>
                </div>

                <footer className='w-full relative z-20 py-8 md:py-12 px-4 bg-foreground text-background text-sm'>
                    <div className='max-w-7xl mx-auto flex gap-5 flex-wrap justify-between items-center'>
                        <div className='flex gap-4 w-full items-center'>
                            <AppLogo />
                            <Text>
                                &copy; {(new Date()).getFullYear()} {APPCONFIG.title}. All rights reserved
                            </Text>
                        </div>
                        <div className='flex gap-5 justify-center w-full items-center'>
                            <a href='#' className=''>
                                Privacy
                            </a>
                            <a href='#' className=''>
                                Terms
                            </a>

                            <div className='flex gap-5 items-center text-lg'>
                                <FaXTwitter />
                                <FaInstagram />
                                <FaFacebook />
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </TitleProvider>
    );
}
