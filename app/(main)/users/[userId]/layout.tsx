"use client";

import React, { useCallback } from "react";
import NotFoundPage from '@/app/not-found';
import { useGetUserById, useGetUserProperties } from '@/hooks/useGetUsers';
import NoNetwork from '@/components/no-network';
import ProfileHeader from '@/components/profile/header';
import ProfileCard from '@/components/profile/profile-card';
import InternalErrorPage from '@/app/internal-error';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { cn } from '@/lib/utils';


export default function ProfileLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { userId: string };
}>) {
    const actor = useAuthenticatedUser();
    const { userId } = params;
    const [isLoading, user, error] = useGetUserById(userId, actor);

    if (!isLoading) {
        if (error !== null && error.code) {
            if (error?.code === 'ERR_NETWORK') {
                return <NoNetwork />
            }
            if (error.response && error.response.status == 404) {
                const res = error.response.data;
                return <NotFoundPage text='Sorry, we could not find any user by the given id. You must have followed a broken link.' />
            }
        } else if (user === null) {
            console.error(error);
            return <InternalErrorPage />
        }
    }

    return (
        <div id='user-profile' className={cn('relative flex flex-col')}>
            <header id='profile-header' className='flex flex-col header w-full'>
                <div className='flex flex-col gap-3 relative px-4 lg:px-8'>
                    <ProfileHeader userId={userId} />
                </div>
            </header>
            <main id='profile-body' className='px-4 lg:px-8'>
                <aside className='sidebar'>
                    {user != null && <ProfileCard user={user} />}
                </aside>
                <main className='major'>
                    {children}
                </main>
            </main>
        </div>
    );
}
