"use client";

import React, { Suspense, memo, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, DataTableLoading } from '@/components/ui/data-table';
import { columns } from '@/components/dashboard/table-columns/users';
import { Heading } from '@/components/ui/headers';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { useGetUsers } from '@/hooks/useGetUsers';

const Users = () => {
    const actor = useAuthenticatedUser();
    const [isLoading, users, error] = useGetUsers(actor as AppUser);

    return (
        <div className='flex flex-col gap-5'>
            <Card>
                <CardContent className='pt-5'>
                    <DataTable 
                    columns={columns} 
                    data={users} 
                    fallback={ isLoading ? 'Loading, please wait...' : 'No users at the moment...'} />
                </CardContent>
            </Card>
        </div>
    );
}

export default Users;