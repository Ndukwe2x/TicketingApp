"use client";

import React, { useCallback } from "react";
import ProfileHeader from '@/components/profile/header';
import ProfileCard from '@/components/profile/profile-card';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { cn } from '@/lib/utils';
import { useEffect } from "react";
import { usePageHeader } from "@/hooks/usePageHeaderContext";


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
                        <ProfileHeader account={actor} />
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
