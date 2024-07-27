"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from '@radix-ui/react-icons';
import { IoLocationSharp } from 'react-icons/io5';
import React, { Suspense, useEffect, useState } from 'react';
import { Text } from '@/components/ui/text';
import Image from 'next/image';
import { useGetEventById } from '@/hooks/useGetEvents';
import { cn, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';
import { ticketCategoryColumns } from '@/components/dashboard/table-columns/ticket-categories';
import TicketsSoldForEvent from '@/components/dashboard/tickets-sold-for-event';
import Loading from './loading';
import { EventPosters } from '@/components/dashboard/event-posters';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { useGetUsersByEvent } from '@/hooks/useGetUsers';
import { columns } from '@/components/dashboard/table-columns/team';
import { usePageHeader } from '@/hooks/usePageHeaderContext';
import DeleteEventButton from '@/components/buttons/delete-event-button';
import EditEventButton from '@/components/buttons/edit-event-button';
import AddTeamMember from '@/components/buttons/add-team-member';
import Link from 'next/link';
import { MdDelete, MdEdit } from 'react-icons/md';
import RenderPrettyError from '@/components/render-pretty-error';

export default function ViewEvent({ params }: { params: { eventId: string } }) {
    const actor = useAuthenticatedUser();
    const { eventId } = params;
    const [eventLoading, event, eventError] = useGetEventById(eventId, actor as AppUser);
    const [teamLoading, organizingTeam, teamError] = useGetUsersByEvent(eventId, actor as AppUser);
    const [teamFallback, setTeamFallback] = useState('Loading team, please wait...');
    const { setPageTitle, setIsPageTitleEnabled, setWidget } = usePageHeader();

    useEffect(() => {
        if (teamError) {
            setTeamFallback(teamError.message);
        }
        // setIsPageTitleEnabled && setIsPageTitleEnabled(false);
        setPageTitle(null);
        if (!eventLoading && !eventError) {
            setWidget((
                <React.Fragment>
                    <div className='flex items-end gap-3 ml-auto'>
                        {/* <AttachUserToEvent event={event} /> */}
                        <Link href={'/events'} className={
                            cn('border border-primary disabled:opacity-50 disabled:pointer-events-none',
                                'flex focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                'font-medium gap-2 h-9 hover:bg-primary hover:text-white items-center',
                                'justify-center lg:px-4 md:px-2 px-2 py-2 rounded-md shadow-sm text-primary',
                                'text-sm transition-colors whitespace-nowrap')
                        }> All Events</Link>
                        <EditEventButton event={event as SingleEvent} actor={actor as AppUser} variant='outline' className='px-2 md:px-3 lg:px-4'>
                            <span className='hidden md:inline-flex mr-2'>Edit</span><MdEdit size={18} />
                        </EditEventButton>
                        <DeleteEventButton actor={actor as AppUser} event={event as SingleEvent} className='px-2 md:px-3 lg:px-4'>
                            <span className='hidden md:inline-flex mr-2'>Delete</span><MdDelete size={18} />
                        </DeleteEventButton>
                    </div>
                </React.Fragment>
            ));
        }
    }, [teamLoading, organizingTeam, teamError, setPageTitle, setWidget, actor, eventError, event]);

    if (eventError) {
        return <RenderPrettyError error={eventError} />
    }

    return (
        event
            ?
            <div>
                <Card>
                    <CardContent className='relative flex aspect-[3/2] md:aspect-[5/2] items-center justify-center p-3'>
                        <Image
                            src={event.eventBanner.url}
                            alt={event.title}
                            className='rounded-lg card-img event-page_event-banner'
                            width={238}
                            height={160}
                        />
                        {/* <Image
                            src={event.eventBanner.url}
                            alt={event.title}
                            className='rounded-lg card-img event-page_event-banner'
                            width={1000}
                            height={400}
                        />
                        <Image
                            src={event.eventBanner.url}
                            alt={event.title}
                            className='rounded-lg card-img event-page_event-banner'
                            width={1000}
                            height={400}
                        /> */}
                    </CardContent>
                </Card>

                <section className='flex-cols-[3:1] justify-between gap-5 relative'>
                    <div>
                        <div className='flex flex-col gap-3'>
                            <Text asLabel>{formatDate(new Date(event.eventDate), 'dddd, MMMM DD')}</Text>
                            <Text variant='h1'>{event.title}</Text>
                        </div>
                    </div>
                    <aside className='h-fit bottom-2 left-0 right-0 md:top-24'>
                        <div>
                            {/* <AttachUserToEvent event={event} /> */}
                            {/* <div className='flex items-end gap-3 mb-4 lg:mb-5'>
                                <EditEventButton event={event} actor={actor as AppUser} variant='outline' />
                                <DeleteEventButton actor={actor as AppUser} event={event} />
                            </div> */}
                        </div>
                    </aside>
                </section>
                <div className='flex-cols-[3:1] justify-between mt-10 gap-5 relative'>
                    <div className='flex flex-col gap-10 mb-10'>

                        <section className='relative h-fit grid grid-cols-2 max-w-2xl gap-4'>
                            <div className='flex gap-2'>
                                <CalendarIcon className='h-6 w-6' />
                                <div className='flex flex-col gap-2'>
                                    <Text variant='h4'>Date & Time</Text>
                                    <Text>
                                        {formatDate(new Date(event.eventDate), 'dddd, MMMM DD YYYY')}
                                        <br />
                                        {formatDate(new Date(event.eventDate), 'hh:mm A')}
                                    </Text>
                                </div>
                            </div>

                            <div className='flex gap-1 border-l pl-[5%]'>
                                <div>
                                    <IoLocationSharp className='h-6 w-6' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Text variant='h4'>Venue</Text>

                                    <Text>{event.address}</Text>
                                </div>
                            </div>
                        </section>
                        {/* {
                            (event.description) &&
                            <section className='flex flex-col gap-4'>
                                <Text variant='h3'>About this event</Text>
                                <Text>{event.description}</Text>
                            </section>
                        } */}
                        <section>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tickets Categories</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DataTable columns={ticketCategoryColumns}
                                        data={event.ticketCategories} fallback='Loading, please wait...' />
                                </CardContent>
                            </Card>
                        </section>
                        <section>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tickets Sold</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <TicketsSoldForEvent event={event as SingleEvent & { ticketsSold: [] | Ticket[] }} />
                                </CardContent>
                            </Card>
                        </section>
                        <section>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organizing Team</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DataTable columns={columns} data={organizingTeam as AppUser[]} fallback={teamFallback} />
                                </CardContent>
                            </Card>
                        </section>
                    </div>

                    <aside className='h-fit bottom-2 left-0 right-0 md:top-24'>
                        <Card>
                            <CardContent className='p-3'>
                                <Text variant='h3' className='mb-3'>Posters</Text>
                                <EventPosters posters={event.posters} className='mb-5' />
                            </CardContent>
                        </Card>
                        {/* <ReserveSpotCard event={event} /> */}
                    </aside>
                </div>
            </div>
            :
            <Loading />
    );
}
