'use client';

import React from 'react';
import Link from 'next/link';
import { Text } from '@/components/ui/text';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';
import { PriceTag } from './price-tag';
import { useGetEvents } from '@/hooks/useGetEvents';
import { Skeleton } from './ui/skeleton';
import { MdEvent } from 'react-icons/md';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';

export function Upcoming() {
    const actor = useAuthenticatedUser();
    const [isLoading, events, error] = useGetEvents(actor as AppUser);

    return (
        <div className='flex flex-col gap-5 mt-4'>
            <Text variant='h2'>Upcoming</Text>

            <div className='grid gap-10 lg:grid-cols-[3fr_2fr] h-max mb-5'>
                {isLoading || !events ? (
                    <ShowcaseEventListItemLoading />
                ) : (
                    <ShowcaseEventListItem event={events[0]} />
                )}

                <div className='flex flex-col gap-5'>
                    {isLoading || !events ? (
                        <>
                            <EventListItemLoading />
                            <EventListItemLoading />
                            <EventListItemLoading />
                        </>
                    ) : (
                        <>
                            {events?.map(
                                (event, idx) =>
                                    idx > 4 &&
                                    idx <= 7 && <EventListItem key={event._id} event={event} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function ShowcaseEventListItem({ event }: { event: SingleEvent }) {
    const href = `/events/${event._id}`;

    return (
        <div className='h-full'>
            <Link href={`/events/${event._id}`}>
                <div className='relative min-h-72 h-2/3 overflow-hidden'>
                    <Image
                        src={event.eventBanner.url}
                        alt={event.title}
                        fill
                        objectFit='cover'
                        className='rounded-lg'
                    />
                </div>
            </Link>

            <div className='py-3 flex flex-col justify-between'>
                <Link href={href} className='w-fit'>
                    <Text asLabel className='text-xs flex items-center gap-2 mb-2'>
                        <MdEvent />
                        {formatDate(new Date(event.eventDate), 'dddd, MMMM DD')}
                    </Text>
                    <Text variant='h3' className='line-clamp-1'>
                        {event.title}
                    </Text>
                </Link>

                {/* <div className='w-full flex items-center justify-between gap-2'>
                    <Link href={href} className='w-fit'>
                        <PriceTag price={event.price} />
                    </Link>
                </div> */}
            </div>
        </div>
    );
}

function ShowcaseEventListItemLoading() {
    return (
        <div className='h-full min-h-72 mb-10 lg:mb-0'>
            <Skeleton className='w-full h-2/3' />
            <div className='flex flex-col gap-2 mt-5'>
                <Skeleton className='h-5 w-2/3 lg:w-2/5' />
                <Skeleton className='h-3 w-full lg:w-5/6' />
                <Skeleton className='h-3 w-full lg:w-5/6' />

                <Skeleton className='h-5 w-40 mt-5' />
            </div>
        </div>
    );
}

function EventListItem({ event }: { event: SingleEvent }) {
    const href = `/events/${event._id}`;

    return (
        <div className='grid gap-2 sm:gap-5 grid-cols-[2fr_3fr]'>
            <div className='relative aspect-[5/4] max-h-full overflow-hidden'>
                <Image
                    src={event.eventBanner.url}
                    alt={event.title}
                    fill
                    objectFit='cover'
                    className='rounded-lg'
                />
                {event.featured && (
                    <div
                        className={cn(
                            'absolute top-4 -left-8 -rotate-45 px-2 py-1 rounded-md',
                            'bg-accent text-accent-foreground w-32 text-center text-xs uppercase'
                        )}
                    >
                        Featured
                    </div>
                )}
            </div>

            <div className='flex flex-col justify-between'>
                <div>
                    <Text asLabel className='text-xs mb-1 sm:mb-2 flex items-center gap-2'>
                        <MdEvent />
                        {formatDate(new Date(event.eventDate), 'dddd, MMMM DD')}
                    </Text>
                    <Link href={href} className='w-fit'>
                        <Text variant='h4' className='line-clamp-1'>
                            {event.title}
                        </Text>
                    </Link>
                    {/* <Text asLabel className='line-clamp-2'>
                        {event.summary}
                    </Text> */}
                </div>

                {/* <div className='w-full flex flex-wrap items-center justify-between gap-1'>
                    <Link href={href} className='w-fit'>
                        <PriceTag price={event.price} />
                    </Link>
                </div> */}
            </div>
        </div>
    );
}

function EventListItemLoading() {
    return (
        <div className='grid gap-2 sm:gap-5 grid-cols-[2fr_3fr]'>
            <div className='relative aspect-[5/4] max-h-full'>
                <Skeleton className='w-full h-full' />
            </div>

            <div className='flex flex-col justify-between py-3'>
                <div className='flex flex-col gap-2'>
                    <Skeleton className='h-5 w-2/3 sm:w-2/3' />
                    <Skeleton className='h-3 w-full sm:w-5/6' />
                    <Skeleton className='h-3 w-full sm:w-5/6' />
                </div>

                <div className='w-full flex items-center justify-between gap-1'>
                    <Skeleton className='h-5 w-40' />
                </div>
            </div>
        </div>
    );
}
