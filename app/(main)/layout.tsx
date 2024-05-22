"use client";

import { cn } from '@/lib/utils';
import { MainNav } from '@/components/main-nav';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { APPCONFIG } from '@/lib/app-config';
import { Text } from '@/components/ui/text';
import { AppLogo } from '@/components/app-logo';
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';

import React from "react";
// import { Session } from '@/lib/session';
import { useRouter, usePathname } from "next/navigation";
import { AuthFreeRoutes } from '@/lib/auth-free-routes';
import {User} from '@/lib/logged-user';
import CreateEventButton from '@/components/buttons/create-event-button';
import CreateUserButton from '@/components/buttons/create-user-button';
import { Toaster, toast } from '@/components/ui/sonner';
import { Session } from '@/lib/session';


export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const route = usePathname();
    const isAuthenticated = User === null ? false : true;
    // const summary = await getDashboardSummary();

    if ( !isAuthenticated && !AuthFreeRoutes.includes(route) ) {
        location.assign('/login?redir=' + route);
        return;
    } else if (isAuthenticated && ['/login','/register'].includes(route)) {
        location.assign('/');
        return;
    }

    // (async (u: typeof User) => {
    //     await Session.validateSession(u.token)
    // })(User);

    return (
        <div className={cn('relative min-h-screen flex flex-col justify-between')}>
            <MainNav id="app-header" />
            <div className='bg-secondary flex flex-1 flex-col md:py-16 py-8 w-full'>
                <div className='flex relative '>
                    <DashboardNav />
                    <div id="main" className='flex-1 overflow-y-auto lg:px-10 lg:py-10'>
                        {children}
                        {/* <Toaster position='bottom-left' pauseWhenPageIsHidden={true} closeButton={true} /> */}
                    </div>
                </div>
            </div>

            <footer className='w-full relative z-20 py-8 md:py-12 px-4 bg-foreground text-background text-sm'>
                <div className='max-w-7xl mx-auto flex gap-5 flex-wrap justify-between items-center'>
                    <div className='flex gap-4 items-center'>
                        <AppLogo />
                        <Text>
                            &copy; {(new Date()).getFullYear()} {APPCONFIG.title}. All rights reserved
                        </Text>
                    </div>
                    <div className='flex gap-5 items-center'>
                        <a href='#' className=''>
                            Privacy
                        </a>
                        <a href='#' className=''>
                            Terms
                        </a>

                        <div className='flex gap-5 items-center ml-5 text-lg'>
                            <FaXTwitter />
                            <FaInstagram />
                            <FaFacebook />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
