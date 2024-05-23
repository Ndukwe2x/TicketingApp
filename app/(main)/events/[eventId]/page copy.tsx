"use client";

import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from '@radix-ui/react-icons';
import { IoLocationSharp } from 'react-icons/io5';
import React from 'react';
import { Text } from '@/components/ui/text';
import Image from 'next/image';
import ReserveSpotCard from '@/components/reserve-spot-card';
import { useGetEventById, useuseGetEventById } from '@/hooks/useGetEvent';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { User } from '@/lib/logged-user';

export default async function ViewEvent({ params }: { params: { eventId: string } }) {
    const user = User;
    const { eventId } = params;
    const event = await useuseGetEventById(eventId, user);

    if (!event) {
        notFound();
    }

    return (
        <div>
            <Card>
                <CardContent className='relative flex aspect-[3/2] md:aspect-[5/2] items-center justify-center p-6'>
                    <Image
                        src={event.image}
                        alt='event'
                        fill
                        objectFit='cover'
                        className='rounded-lg'
                    />
                </CardContent>
            </Card>

            <div className='md:flex justify-between mt-10 gap-5 relative'>
                <div className='flex flex-col gap-10 max-w-3xl mb-10'>
                    <section>
                        <Text asLabel>{formatDate(event.date, 'dddd, MMMM DD')}</Text>
                        <Text variant='h1'>{event.title}</Text>
                        <Text>{event.summary}</Text>
                    </section>

                    <section className='relative h-fit grid grid-cols-2 max-w-2xl gap-2'>
                        <div className='flex gap-2'>
                            <CalendarIcon className='h-6 w-6' />
                            <div className='flex flex-col gap-2'>
                                <Text variant='h4'>Date & Time</Text>

                                <Text>
                                    {formatDate(event.date, 'dddd, MMMM DD YYYY')}
                                    <br />
                                    {formatDate(event.date, 'hh:mm A')}
                                </Text>
                            </div>
                        </div>

                        {/*<div className='w-0.5 h-full ml-4 bg-gray-200' />*/}

                        <div className='flex gap-1 border-l pl-[5%]'>
                            <div>
                                <IoLocationSharp className='h-6 w-6' />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Text variant='h4'>Venue</Text>

                                <Text>{event.location}</Text>
                            </div>
                        </div>
                    </section>

                    <section className='flex flex-col gap-4'>
                        <Text variant='h3'>About this event</Text>
                        <Text>{event.description}</Text>
                    </section>
                </div>

                <aside className='sticky h-fit bottom-2 left-0 right-0 z-50 bg-white md:sticky md:top-24'>
                    <ReserveSpotCard event={event} />
                </aside>
            </div>
        </div>
    );
}
