"use client";

import React, { useCallback } from "react";
import ProfileHeader from '@/components/profile/header';
import ProfileCard from '@/components/profile/profile-card';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { cn } from '@/lib/utils';
import { useEffect } from "react";
import { usePageHeader } from "@/hooks/usePageHeaderContext";
import LoadingUserProfile from "./loading";


export default function ProfileLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const actor = useAuthenticatedUser();
    const { setPageTitle } = usePageHeader();

    useEffect(() => {
        setPageTitle(null);
    }, [setPageTitle]);

    return (
        actor && <div id='user-profile' className={cn('relative flex flex-col')}>
            {children}
        </div>
    )
}
