"use client";

import React, { Suspense, memo, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, DataTableLoading } from '@/components/ui/data-table';
import { columns } from '@/components/dashboard/table-columns/users';
import { Heading } from '@/components/ui/headers';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { useGetUsers } from '@/hooks/useGetUsers';
import { useRouter } from 'next/navigation';
import NotFoundPage from '../../[...not-found]/page';
import InternalErrorPage from '@/app/internal-error';
import RenderPrettyError from '@/components/render-pretty-error';
import UserClass from '@/lib/User.class';
import LoadingDashboardUsers from './__loading';

export default function Users() {
    const actor = useAuthenticatedUser();
    const [isLoading, rawUsers, error] = useGetUsers(actor as AppUser);
    const router = useRouter();

    if (error) {
        return <RenderPrettyError error={error} />
    }

    const users = rawUsers.map((user: any) => (new UserClass(user) as unknown) as AppUser);

    return (
        isLoading || error ? (
            <LoadingDashboardUsers />
        ) : (
            <div className='flex flex-col gap-5'>
                <Card>
                    <CardContent className='pt-5'>
                        <DataTable
                            columns={columns}
                            data={users}
                            fallback={isLoading ? 'Loading, please wait...' : 'No users at the moment...'} />
                    </CardContent>
                </Card>
            </div>
        )
    );
}
