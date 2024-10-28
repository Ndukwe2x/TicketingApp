"use client";

import React, { useCallback } from "react";
import ProfileHeader from '@/components/profile/header';
import ProfileCard from '@/components/profile/profile-card';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { cn } from '@/lib/utils';
import { useEffect } from "react";
import { usePageHeader } from "@/hooks/usePageHeaderContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableLoading } from "@/components/ui/data-table";

const ProfileHeaderSkeleton = () => (
    <React.Fragment>
        <div className="account-name flex justify-between items-center mb-4">
            <Skeleton className="h-10 mb-3 w-2/5" />
            <div className="hidden md:flex gap-4">
                <Skeleton className="w-40 h-9" />
                <Skeleton className="w-[100px] h-9" />
            </div>
            <Skeleton className="md:hidden">
                <Skeleton className="h-4 mb-3 w-2/3" />
            </Skeleton>
        </div>
        <div className='action-btns hidden md:flex'>
            <Skeleton className="h-9 mb-3 w-40 rounded-lg" />
            <Skeleton className="h-9 mb-3 w-40 rounded-lg" />
        </div>
    </React.Fragment>
);

const ProfileCardSkeleton = () => (
    <Card>
        <CardContent>
            <Skeleton className="profile-card-avatar avatar rounded-full" />
            <div className='grid grid-cols-2 gap-5'>
                <div className="flex flex-col items-center">
                    <Skeleton className="h-3 mb-2 w-3/4" />
                    <Skeleton className="h-3 w-9" />
                </div>
                <div className="flex flex-col items-center">
                    <Skeleton className="h-3 mb-2 w-3/4" />
                    <Skeleton className="h-3 w-9" />
                </div>
            </div>
            <hr className="my-3" />
            <div className="grid gap-3">
                <Skeleton className="w-2/3 mb-3 h-3.5" />
                <div className="flex gap-3 flex-col">
                    <div className="flex gap-5">
                        <Skeleton className="h-4 mb-3 w-1/4" />
                        <Skeleton className="h-4 mb-3 w-2/3" />
                    </div>
                    <div className="flex gap-5">
                        <Skeleton className="h-4 mb-3 w-1/4" />
                        <Skeleton className="h-4 mb-3 w-2/3" />
                    </div>
                    <div className="flex gap-5">
                        <Skeleton className="h-4 mb-3 w-1/4" />
                        <Skeleton className="h-4 mb-3 w-2/3" />
                    </div>
                    <div className="flex gap-5">
                        <Skeleton className="h-4 mb-3 w-1/4" />
                        <Skeleton className="h-4 mb-3 w-2/3" />
                    </div>
                    <div className="flex gap-5">
                        <Skeleton className="h-4 mb-3 w-1/4" />
                        <Skeleton className="h-4 mb-3 w-2/3" />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const ContentSkeleton = () => (
    <Card>
        <CardHeader className="flex-row items-center justify-between">
            <CardTitle>
                <Skeleton className="w-32 h-4" />
            </CardTitle>
            <div className="flex gap-1">
                <Skeleton className="w-9 h-9" />
                <Skeleton className="w-9 h-9" />
            </div>
        </CardHeader>
        <CardContent>
            {/* <div className="grid grid-cols-1 md:grid-cols-2">
                <Skeleton className="h-44 w-1/2 p-4 flex flex-col justify-end">
                    <Skeleton className="w-32 h-4" />
                </Skeleton>
            </div> */}
            <div className='flex flex-col gap-5'>
                <DataTableLoading showHeader={true} columnCount={5} rowHeight={9} rowSpacing={2} />
            </div>
        </CardContent>
    </Card>
)

export default function LoadingUserProfile() {
    return (
        <React.Fragment>
            <header id='profile-header' className='flex flex-col header w-full'>
                <div className='flex flex-col gap-3 relative px-4 lg:px-8'>
                    <ProfileHeaderSkeleton />
                </div>
            </header>
            <main id='profile-body' className='px-4 lg:px-8'>
                <aside className='sidebar'>
                    <ProfileCardSkeleton />
                </aside>
                <main className='major'>
                    <ContentSkeleton />
                </main>
            </main>
        </React.Fragment>
    );
}
