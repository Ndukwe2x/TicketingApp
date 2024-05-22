"use client";

import { cn } from '@/lib/utils';
import { MainNav } from '@/components/main-nav';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { APPCONFIG } from '@/lib/app-config';
import { Text } from '@/components/ui/text';
import { AppLogo } from '@/components/app-logo';
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthFreeRoutes } from '@/lib/auth-free-routes';
import {User} from '@/lib/logged-user';
import { Toaster, toast } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import NotFoundPage from '@/app/not-found';
import { useGetUserById, useGetUserProperties } from '@/hooks/useGetUsers';
import { AxiosError } from 'axios';
import NoNetwork from '@/components/no-network';
import { useGetEventsByUser } from '@/hooks/useGetEvents';
import { Api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import ProfileHeader from '@/components/profile/header';
import ProfileCard from '@/components/profile/profile-card';
import InternalErrorPage from '@/app/internal-error';


export default function ProfileLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { userId: string };
}>) {
    const actor = User;
    const route = usePathname();

    if ( !actor && !AuthFreeRoutes.includes(route) ) {
        location.assign('/login?redir=' + route);
        return;
    } else if (actor && ['/login', '/register'].includes(route)) {
        location.assign('/');
        return;
    }

    const { userId } = params;
    const [user, isLoading, error] = useGetUserById(userId, actor);

    if (isLoading) {
        return <></>
    } else if ( error !== null ) {
        if ( error?.code === 'ERR_NETWORK' ) {
            return <NoNetwork />
        }
        if ( error.response && error.response.status == 404 ) {
            const res = error.response.data;
            return <NotFoundPage text='Sorry, we could not find any user by the given id. You must have followed a broken link.' />
        }
    } else if ( user === null ) {
        return <InternalErrorPage />
    }
    
    return (
        user &&
        <div id='user-profile' className={cn('relative flex flex-col')}>
            <header id='profile-header' className='flex flex-col header w-full'>
                <div className='flex flex-col gap-3 relative px-4 lg:px-8'>
                    <ProfileHeader userId={ userId} />
                </div>
            </header>
            <main id='profile-body' className='px-4 lg:px-8'>
                <aside className='sidebar'>
                    <ProfileCard user={ user } />
                </aside>
                <main className='major'>
                    { children }
                </main>
            </main>
        </div>
    );
}
