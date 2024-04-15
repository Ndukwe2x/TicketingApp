"use client";

import * as React from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
// import { DataTable } from '@/components/ui/data-table';
import { getPublicEvents } from '@/hooks/getPublicEvents';
import { EventCard } from '@/components/event-card';
import { FilterTools } from '@/components/filter-tools';
// import { columns } from '@/components/dashboard/table-columns/events';


export default function Events() {
    const [result, setResult] = React.useState({});
    const {events, ...res} = getPublicEvents();

    
    

    return (
        <div className='flex flex-col gap-5'>
            <div className="flex flex-row items-center justify-between">
                <Text variant='h1' className='py-4 page-title'>Events</Text>
                <FilterTools subject='Event' className="w-3/4" />
            </div>
            
            {
                events.length 
                    ? (
                        <ul role='list' className='row-with-4-cols gutters-3 nmx-3 grid-cols-4 grid gap-5'>
                        {events.map((event, index) => <li key={index}>
                            <EventCard event={event} />
                            </li>)}
                        </ul>
                    ) : (
                        <div className="no-data text-center">
                            <Text variant='h3'>There are no events right now... </Text>
                            <Text variant='p'>Looking for a particular event? Check back later.</Text>
                        </div>
                    )
                
            }
        </div>
    )
}
