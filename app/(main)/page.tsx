"use client";

import React, { Suspense } from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/headers';
import MyEvents from '@/components/dashboard/my-events';
import LayoutToggle from '@/components/buttons/layout-toggle';
import MyTickets from '@/components/dashboard/my-tickets';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';


export default function Dashboard() {
    const actor = useAuthenticatedUser();
    const [eventsLayout, setEventsLayout] = React.useState<string>('table');
    const [ticketsLayout, setTicketsLayout] = React.useState<string>('table');
    const [owner, setOwner] = React.useState(actor?.isUser ? actor : null);

    return (
        <div className='flex flex-col gap-5'>
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <Text variant='h4'>Recent Events</Text>
                    <div className='flex flex-row items-center justify-between'>
                        <div><LayoutToggle callback={setEventsLayout} layout={eventsLayout} /></div>
                    </div>
                </CardHeader>
                <CardContent className='overflow-auto'>
                    <MyEvents 
                    layout={eventsLayout}
                    isFilteringEnabled={true} 
                    filterParams={['_id', 'title', 'state', 'city', 'address', 'date']}
                    owner={ owner } />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <Text variant='h4'>Recent Ticket Sales</Text>
                    <div className='flex flex-row items-center justify-between'>
                        <div><LayoutToggle callback={setTicketsLayout} layout={ticketsLayout} /></div>
                    </div>
                </CardHeader>
                <CardContent className='overflow-auto'>
                    <MyTickets 
                        layout={ticketsLayout}
                        isFilteringEnabled={true} 
                        filterParams={['event_title','name','email','phone','ticketCategory','eventRef']}
                        >
                    </MyTickets>
                </CardContent>
            </Card>
        </div>
    );
}
