"use client";

import React, { Suspense } from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { SummaryCardList } from '@/components/dashboard/summary-card-list';
// import { getDashboardSummary } from '@/hooks/useGetDashboard';
import { SalesTable } from '@/components/dashboard/sales-table';
import { DataTableLoading } from '@/components/ui/data-table';
import { CreateTicket } from '@/components/dashboard/create-ticket';
import { Heading } from '@/components/ui/headers';
// import MyEvents from '@/components/dashboard/my-events';
import { User } from '@/lib/logged-user';


export default function Dashboard() {
    const user = User;
    const viewer = user.user.userStatus;
    const [layout, setLayout] = React.useState('');

    return (
        <div className='flex flex-col gap-5'>
            <Heading variant='h1'>Dashboard</Heading>

            {/* <SummaryCardList summary={summary} /> */}
            {
                viewer === 'user' &&
                <Card>
                    <CardHeader className='flex-row items-center justify-between'>
                        <Text variant='h4'>Sales</Text>
                        <CreateTicket />
                    </CardHeader>
                    <CardContent className='overflow-auto'>
                        <Suspense fallback={<DataTableLoading />}>
                            {/* <Events user={ User } /> */}
                            <SalesTable />
                        </Suspense>
                    </CardContent>
                </Card>
            }
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <Text variant='h4'>Events</Text>
                </CardHeader>
                <CardContent className='overflow-auto'>
                    <Suspense fallback={<DataTableLoading />}>
                        {/* <MyEvents /> */}
                    </Suspense>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <Text variant='h4'>Tickets</Text>
                    <div className='flex flex-row items-center justify-between'>
                        {/* <div><LayoutToggle /></div> */}
                        {/* <div><AddCategory /></div> */}
                    </div>
                </CardHeader>
                <CardContent className='overflow-auto'>
                    <Suspense fallback={<DataTableLoading />}>
                        {/* <MyEvents /> */}
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
