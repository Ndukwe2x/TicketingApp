"use client";

import React, { Suspense } from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { getDashboardUsers } from '@/hooks/useGetDashboard';
import { columns } from '@/components/dashboard/table-columns/users';
import { User } from '@/lib/logged-user';
import { Api } from '@/lib/api';
import axios, { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import LoadingDashboardUsers from './loading';

export default async function Users() {
    const user = User();
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        (async (user) => {
            const result = await getDashboardUsers(user);
            const data = result.filter(row => row.accountType === 'user');
            setUsers(data);
        })(user);

        return;
    }, []);

    return (
        <div className='flex flex-col gap-5'>
            <Text variant='h1'>Users</Text>
            <Card>
                <CardContent className='pt-5'>
                    <DataTable columns={columns} data={users} fallback={ <LoadingDashboardUsers columnCount={9} />} />
                </CardContent>
            </Card>
        </div>
    );
}
