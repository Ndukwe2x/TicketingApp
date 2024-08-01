'use client';

import React from 'react';
import { Text } from '@/components/ui/text';
import { EventCard, LoadingEventCard } from './event-card';
import { useGetEvents } from '@/hooks/useGetEvents';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';

export function LiveEvents() {
    const actor = useAuthenticatedUser();
    const [isLoading, events, error] = useGetEvents(actor as AppUser);

    let body = (
        <>
            {events?.map((event) => (
                <EventCard key={event._id} event={event} />
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
