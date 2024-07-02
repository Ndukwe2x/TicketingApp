"use client";

import React, { Suspense } from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MyEvents from '@/components/dashboard/my-events';
import MyTickets from '@/components/dashboard/my-tickets';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import ToggleView from '@/components/buttons/viewtype-toggle';


export default function Dashboard() {
    const actor = useAuthenticatedUser();
    const [owner, setOwner] = React.useState<AppUser | null>(null);
    const [eventsLayout, setEventsLayout] = React.useState<ViewType>('list');
    const [ticketsLayout, setTicketsLayout] = React.useState<ViewType>('list');


    React.useEffect(() => {
        if (actor != null && actor?.isUser) {
            setOwner(actor);
        }
        const storedEventsLayout = localStorage.getItem(`viewType_events`) || 'list';
        const storedTicketsLayout = localStorage.getItem(`viewType_tickets`) || 'list';
        setEventsLayout(storedEventsLayout as ViewType);
        setTicketsLayout(storedTicketsLayout as ViewType);
    }, [actor]);

    return (
        <div className='flex flex-col gap-5'>
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <Text variant='h4'>Recent Events</Text>
                    <div className='flex flex-row items-center justify-between'>
                        <div><ToggleView setExternalViewType={setEventsLayout} dataSetId={'events'} /></div>
                    </div>
                </CardHeader>
                <CardContent className='overflow-auto'>
                    <MyEvents
                        layout={eventsLayout}
                        isFilteringEnabled={true}
                        filterParams={['_id', 'title', 'state', 'city', 'address', 'date']}
                        owner={owner} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <Text variant='h4'>Recent Ticket Sales</Text>
                    <div className='flex flex-row items-center justify-between'>
                        <div><ToggleView setExternalViewType={setTicketsLayout} dataSetId={'tickets'} /></div>
                    </div>
                </CardHeader>
                <CardContent className='overflow-auto'>
                    <MyTickets
                        layout={ticketsLayout}
                        isFilteringEnabled={true}
                        filterParams={['event_title', 'name', 'email', 'phone', 'ticketCategory', 'eventRef']}
                    >
                    </MyTickets>
                </CardContent>
            </Card>
        </div>
    );
}
