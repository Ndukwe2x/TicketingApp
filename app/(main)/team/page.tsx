"use client";

import React, { Suspense } from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, DataTableLoading } from '@/components/ui/data-table';
import { columns } from '@/components/dashboard/table-columns/users';
import { orderByDate } from '@/lib/utils';
import { Heading } from '@/components/ui/headers';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { useGetTeamMembers } from '@/hooks/useGetUsers';
// import LoadingDashboardUsers from './loading';

export default function Users() {
    const actor = useAuthenticatedUser();
    const [isLoading, teamMembers, error] = useGetTeamMembers(actor, actor);

    return (
        <div className='flex flex-col gap-5'>
        <Heading variant='h1' className='page-title'>My Team</Heading>
            <Card>
                <CardContent className='pt-5'>
                    <DataTable 
                    columns={columns} 
                    data={teamMembers} 
                    fallback='No users at the moment...' />
                </CardContent>
            </Card>
        </div>
    );
}
