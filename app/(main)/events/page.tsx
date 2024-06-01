"use client";

import * as React from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { decorateEvent, getEvents } from '@/hooks/useGetEvents';
import { DataTable, DataTableLoading } from '@/components/ui/data-table';
import { columns } from '@/components/dashboard/table-columns/events';
import NoNetwork from '@/components/no-network';
import { User } from '@/lib/logged-user';
import MyEvents from '@/components/dashboard/my-events';
import LayoutToggle from '@/components/buttons/layout-toggle';
import { Heading } from '@/components/ui/headers';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';


export default function Events() {
    const [layout, setLayout] = React.useState('table');
    const actor = useAuthenticatedUser();
    // const [events, setEvents] = React.useState([]);
    // const [featuredEvents, setFeaturedEvents] = React.useState([]);
    // const [fallback, setFallback] = React.useState<React.JSX.Element | string>(<DataTableLoading />);

    // React.useEffect(() => {
    //     async function fetchAndDecorateEvents() {
    //         try {
    //             const response = await getEvents(User);
    //             if (response && response.data) {
    //                 const fetchedEvents = response.data.events || [];
    //                 const decoratedEvents = await Promise.all(fetchedEvents.map(decorateEvent));
    //                 setEvents(decoratedEvents);
    //                 setFeaturedEvents(decoratedEvents.filter(event => event.featured));
    //             }
    //         } catch (error) {
    //             let feedback = (error.code === 'ERR_NETWORK' || !navigator.onLine)  
    //                 ? <NoNetwork />
    //                 : 'Oops! We\'re unable to fetch your data right now, please try refreshing the page';

    //             setFallback(feedback);
    //         }
    //     }

    //     fetchAndDecorateEvents();
    // }, []);

    return (
        (actor) && 
        <div className='flex flex-col gap-5'>
            <div className="flex flex-row items-center justify-between">
                <Heading variant='h1' className='page-title'>{ actor?.isUser && 'My '}Events</Heading>
            </div>
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    {/* <Text variant='h4'>Events</Text> */}
                    <div className='flex flex-row self-end items-center justify-between'>
                        <LayoutToggle callback={setLayout} layout={layout} />
                    </div>
                </CardHeader>
                <CardContent className='p-5'>
                    <MyEvents 
                    layout={layout}
                    isFilteringEnabled={true} 
                    filterParams={['id', 'title', 'state', 'city', 'address', 'date']} />
                </CardContent>
            </Card>
        </div>
    )
}

