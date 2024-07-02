"use client";

import React, { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import NotFoundPage from '@/app/not-found';
import { useGetUserById, useGetUserProperties } from '@/hooks/useGetUsers';
import NoNetwork from '@/components/no-network';
import ProfileHeader from '@/components/profile/header';
import ProfileCard from '@/components/profile/profile-card';
import InternalErrorPage from '@/app/internal-error';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { cn } from '@/lib/utils';
import { useTitle } from "@/hooks/useTitleContext";
import { useState } from "react";


export default function ProfileLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { userId: string };
}>) {
    const actor = useAuthenticatedUser();
    const { setIsTitleEnabled } = useTitle();

    setIsTitleEnabled(false);

    const { userId } = params;
    const [isLoading, user, error] = useGetUserById(userId, actor as AppUser);
    const [fallback, setFallback] = useState(<div className="text-center">Loading, please wait...</div>)



    useEffect(() => {
        if (!isLoading) {
            return;
        }
        if (error !== null) {
            if (error.code) {
                switch (error.code) {
                    case 'ERR_NETWORK':
                        setFallback(<NoNetwork />)
                        break;
                    default:
                        break;
                }
            }
            if (error.response && error.response.status == 404) {
                // const res = error.response.data;
                setFallback(<NotFoundPage text='Sorry, we could not find any user by the given id. You must have followed a broken link.' />);
            }
        } else if (user === null) {
            console.error(error);
            setFallback(<InternalErrorPage />);
        }

        return () => {

        }
    }, [isLoading, user, error]);

    return (
        user &&
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
