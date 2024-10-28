"use client";

import React, { ReactNode, useCallback } from "react";
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
import LoadingUserProfile from "./loading";
import { isAxiosError } from "axios";
import RenderPrettyError from "@/components/render-pretty-error";


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

    let output: ReactNode = '';

    return (
        <div id='user-profile' className={cn('relative flex flex-col')}>
            {children}
        </div>
    )
}
