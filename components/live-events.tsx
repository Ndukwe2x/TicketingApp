'use client';

import React from 'react';
import { Text } from '@/components/ui/text';
import { EventCard, LoadingEventCard } from './event-card';
import { useGetEvents } from '@/hooks/useGetEvents';

export function LiveEvents() {
    const { liveEvents: events, isLoading } = useGetEvents();

    let body = (
        <>
            {events?.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </>
    );

    if (isLoading) {
        body = (
            <>
                <LoadingEventCard />
                <LoadingEventCard />
                <LoadingEventCard />
            </>
        );
    }

    return (
        <div className='flex flex-col gap-5 mt-4'>
            <Text variant='h2'>Live Events</Text>

            <div className='grid gap-3 md:gap-7 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]'>
                {body}
            </div>
        </div>
    );
}
