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


export default function ProfileLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const actor = useAuthenticatedUser();
    const { setPageTitle } = usePageHeader();

    useEffect(() => {
        setPageTitle(null);
    }, [setPageTitle]);

    return (
        actor && (
            <div id='user-profile' className={cn('relative flex flex-col')}>
                <header id='profile-header' className='flex flex-col header w-full'>
                    <div className='flex flex-col gap-3 relative px-4 lg:px-8'>
                        <ProfileHeader userId={actor.id} />
                    </div>
                </header>
                <main id='profile-body' className='px-4 lg:px-8'>
                    <aside className='sidebar'>
                        {actor != null && <ProfileCard user={actor} />}
                    </aside>
                    <main className='major'>
                        {children}
                    </main>
                </main>
            </div>
        )
    );
}
