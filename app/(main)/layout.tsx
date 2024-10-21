"use client";

import { cn } from '@/lib/utils';
import { MainNav } from '@/components/main-nav';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { APPCONFIG } from '@/lib/app-config';
import { Text } from '@/components/ui/text';
import { AppLogo } from '@/components/app-logo';
import React, { useEffect, useRef, useState } from "react";
import { Session } from '@/lib/session';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import NoNetwork from '@/components/no-network';
import PageHeader from '@/components/dashboard/page-header';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const actor = useAuthenticatedUser();
    const [client, setClient] = useState<any>(null);
    const initialRenderRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(false);
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
        !isLoading && <div ref={initialRenderRef} className={cn('relative min-h-screen flex flex-col justify-between')}>
            <MainNav id="app-header" />
            <div className='flex md:py-16 py-8 w-full main-layout'>
                <DashboardNav />
                <div className='content-area flex flex-col flex-1 relative'>
                    <main id="main" className='flex-1 p-4  lg:px-8 lg:py-8 border rounded-xl bg-secondary'>
                        {
                            // initialRenderRef.current !== null ? (

                            // client && !client.onLine ? (
                            //     <div className='text-center w-full py-9'><NoNetwork /></div>
                            // ) : (
                            <React.Fragment>
                                <PageHeader className='z-[1] relative' />
                                {children}
                            </React.Fragment>
                            // )
                            // ) : (
                            //     // <div style={{ zIndex: '1020' }} className='bg-primary bottom-0 fixed flex flex-col items-center justify-center left-0 right-0 text-2xl text-white top-0'>
                            //     <div className='flex flex-col items-center justify-center text-2xl text-muted-foreground py-[10%]'>
                            //         <Icons.spinner className='h-10 w-10 animate-spin' />
                            //         <span>Loading...</span>
                            //     </div>
                            // )
                        }

                    </main>
                    <footer className='w-full py-8 px-4 text-sm'>
                        <div className='max-w-7xl mx-auto flex gap-4 justify-between items-center flex-col text-center md:text-normal'>
                            <div className='flex flex-col md:flex-row gap-x-4 w-full items-center md:justify-between'>
                                <div className='flex flex-col md:flex-row gap-4 items-center'>
                                    <AppLogo />
                                    <Text>
                                        &copy; {(new Date()).getFullYear()} {APPCONFIG.title} | All rights reserved
                                    </Text>
                                </div>
                                <div className='flex gap-x-3 justify-center md:justify-start items-center'>
                                    <a href='/legal/privacy-policy' className='text-muted-foreground'>
                                        Privacy Policy
                                    </a>
                                    <a href='/legal/terms-of-service' className='text-muted-foreground'>
                                        Terms of Service
                                    </a>
                                </div>
                            </div>
                            <div className='flex flex-col gap-x-5 justify-end w-full md:items-end'>
                                <Link href={'tel:+2348068103366'}
                                    title='+2348068103366|ndletters@gmail.com'>Crafted by <span className='text-primary'>Softcode Technologies</span></Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>


        </div>
    );
}
