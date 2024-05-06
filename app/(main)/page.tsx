"use client";

import React, { Suspense } from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SummaryCardList } from '@/components/dashboard/summary-card-list';
// import { getDashboardSummary } from '@/hooks/useGetDashboard';
import { SalesTable } from '@/components/dashboard/sales-table';
import { DataTableLoading } from '@/components/ui/data-table';
import { CreateTicket } from '@/components/dashboard/create-ticket';
import { Heading } from '@/components/ui/headers';
import { User } from '@/lib/logged-user';
import MyEvents from '@/components/dashboard/my-events';
import { getDashboardSummary } from '@/hooks/useGetDashboard';
import LayoutToggle from '@/components/buttons/layout-toggle';
import MyTickets from '@/components/dashboard/my-tickets';


export default function Dashboard() {
    const user = User;
    const [eventsLayout, setEventsLayout] = React.useState('');
    const [ticketsLayout, setTicketsLayout] = React.useState('');

    const summary = getDashboardSummary();

    return (
        <div className='flex flex-col gap-5'>
            <Heading variant='h1'>Dashboard</Heading>

            {/* <SummaryCardList summary={summary} /> */}
            {
                user.isUser ?
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
                :
                <>
                    <Card>
                        <CardHeader className='flex-row items-center justify-between'>
                            <Text variant='h4'>Events</Text>
                            <div className='flex flex-row items-center justify-between'>
                                <div><LayoutToggle callback={setEventsLayout} layout={eventsLayout} /></div>
                            </div>
                        </CardHeader>
                        <CardContent className='overflow-auto'>
                            <MyEvents 
                            layout={eventsLayout}
                            isFilteringEnabled={true} 
                            filterParams={['_id', 'title', 'state', 'city', 'address', 'date']} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex-row items-center justify-between'>
                            <Text variant='h4'>Tickets</Text>
                            <div className='flex flex-row items-center justify-between'>
                                <div><LayoutToggle callback={setTicketsLayout} layout={ticketsLayout} /></div>
                            </div>
                        </CardHeader>
                        <CardContent className='overflow-auto'>
                            <MyTickets 
                                layout={ticketsLayout}
                                isFilteringEnabled={true} 
                                filterParams={['event_title','name','email','phone','ticketCategory','eventRef']}>

                            </MyTickets>
                        </CardContent>
                    </Card>
                </>
            }
        </div>
    );
}
