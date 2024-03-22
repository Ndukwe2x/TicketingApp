import React from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { getDashboardUsers } from '@/hooks/useGetDashboard';
import { columns } from '@/components/dashboard/table-columns/users';

export default async function Users() {
    const users = await getDashboardUsers();

    return (
        <div className='flex flex-col gap-5'>
            <Text variant='h1'>Users</Text>
            <Card>
                <CardContent className='pt-5'>
                    <DataTable data={users} columns={columns} />
                </CardContent>
            </Card>
        </div>
    );
}
