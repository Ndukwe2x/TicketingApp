"use client";

import React, { useCallback } from "react";
import NotFoundPage from '@/app/not-found';
import { useGetUserById } from '@/hooks/useGetUsers';
import NoNetwork from '@/components/no-network';
import ProfileHeader from '@/components/profile/header';
import ProfileCard from '@/components/profile/profile-card';
import InternalErrorPage from '@/app/internal-error';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { cn } from '@/lib/utils';
import { useEffect } from "react";
import { useState } from "react";
import { usePageHeader } from "@/hooks/usePageHeaderContext";
import Link from "next/link";
import UserSearchForm from "@/components/dashboard/user-search-form";
import { Text } from "@/components/ui/text";


export default function ProfileLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { userId: string };
}>) {
    const actor = useAuthenticatedUser();
    const { userId } = params;
    const [isLoading, user, error] = useGetUserById(userId, actor as AppUser);
    // const [fallback, setFallback] = useState(<div className="text-center">Loading, please wait...</div>);
    const { setPageTitle, setWidget } = usePageHeader();



    // useEffect(() => {
    //     if (!isLoading) {
    //         return;
    //     }
    //     if (error !== null) {
    //         if (error.code) {
    //             switch (error.code) {
    //                 case 'ERR_NETWORK':
    //                     // setFallback(<NoNetwork />)
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         }
    //         if (error.response && error.response.status == 404) {
    //             // const res = error.response.data;
    //             setFallback(<NotFoundPage text='Sorry, we could not find any user by the given id. You must have followed a broken link.' />);
    //         }
    //     } else if (user === null) {
    //         setFallback(<InternalErrorPage />);
    //     }

    //     return () => {

    //     }

    // }, [isLoading, user, error]);

    useEffect(() => {
        setPageTitle(null);
        if (!actor) {
            return;
        }
        if (actor.canViewTeamMembers) {
            setWidget((
                <React.Fragment>
                    <div className='flex items-end gap-3 ml-auto'>
                        <Link href={actor.isOwner ? '/users' : '/team'} className={
                            cn('border border-primary disabled:opacity-50 disabled:pointer-events-none',
                                'flex focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                'font-medium gap-2 h-9 hover:bg-primary hover:text-white items-center',
                                'justify-center lg:px-4 md:px-2 px-2 py-2 rounded-md shadow-sm text-primary',
                                'text-sm transition-colors whitespace-nowrap')
                        }>Users</Link>
                    </div>
                </React.Fragment>
            ));
        }
    }, [actor, setPageTitle, setWidget]);

    const handleSearchResult = (result: UserInfo[]) => {

    }

    return (
        !isLoading && (
            user ? (
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
            ) : (
                <React.Fragment>
                    <NotFoundPage heading="User Not Found!" text="Sorry, but we could't find the user you're looking for." />
                    <div id="search-bar" className="mt-10">
                        <div className="lg:w-5/6 mx-auto">
                            <Text variant='h4' className="my-4">Search users, enter firstname or lastname.</Text>
                            <UserSearchForm />
                        </div>
                    </div>
                </React.Fragment>
            )
        )
    );
}
