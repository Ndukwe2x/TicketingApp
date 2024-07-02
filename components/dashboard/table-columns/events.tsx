'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import CountTicketsSoldForEvent from '../count-tickets-sold-for-event';
import EventsListActionsDropdownMenu from '../events-list-actions-dropdown-menu';

export const columns: ColumnDef<SingleEvent>[] = [
    {
        accessorKey: 'title',
        header: () => <div style={{ width: '18rem' }}>Title</div>,
        cell: ({ row }) => <a href={`${location.origin}/events/${row.original._id}`} className='capitalize'>{row.getValue('title')}</a>,
    },
    // {
    //     accessorKey: 'organizers',
    //     header: 'Organizers',
    //     cell: ({ row }) => {
    //         const organizers = row.getValue('organizers') as DashboardEvent['organizers'];

    //         return (
    //             <div className='flex gap-1 flex-wrap'>
    //                 {organizers.map((org, idx) => (
    //                     <div key={org}>
    //                         {org}
    //                         {idx !== organizers.length - 1 && ','}
    //                     </div>
    //                 ))}
    //             </div>
    //         );
    //     },
    // },
    // {
    //     accessorKey: 'sponsors',
    //     header: 'Sponsors',
    //     cell: ({ row }) => {
    //         const sponsors = row.getValue('sponsors') as DashboardEvent['sponsors'];

    //         return (
    //             <div className='flex gap-1 flex-wrap'>
    //                 {sponsors.map((spon, idx) => (
    //                     <div key={spon}>
    //                         {spon}
    //                         {idx !== sponsors.length - 1 && ','}
    //                     </div>
    //                 ))}
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: 'state',
        header: () => <div className='whitespace-nowrap'>State</div>,
        cell: ({ row }) => <div className='whitespace-nowrap'>{row.getValue('state')}</div>,
    },
    {
        accessorKey: 'city',
        header: () => <div className='whitespace-nowrap'>City</div>,
        cell: ({ row }) => <div className='whitespace-nowrap'>{row.getValue('city')}</div>,
    },
    {
        accessorKey: 'address',
        header: () => <div style={{ width: '12rem' }}>Address</div>,
        cell: ({ row }) => <div>{row.getValue('address')}</div>,
    },
    {
        accessorKey: 'eventDate',
        header: ({ column }) => {
            return (
                <div
                    className='flex gap-2 items-center cursor-pointer'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    style={{ width: '12rem' }}
                >
                    Date/Time
                    <CaretSortIcon className='ml-2 h-4 w-4' />
                </div>
            );
        },
        cell: ({ row }) => <div>{formatDate(new Date(row.getValue('eventDate')), 'MMMM DD, YYYY, at hh:mm A')}</div>,
    },
    {
        accessorKey: 'ticketCategories',
        header: () => <div style={{ width: '16rem' }}>Ticket Categories</div>,
        cell: ({ row }) => {
            return (
                // <div className='gap-1.5 grid grid-cols-3 ticket-categories'>
                // </div>
                // {
                row.original.ticketCategories.map((cat, index) => {
                    return (
                        <div key={index} className='flex items-center justify-between gap-2 category-group'>
                            <span className='font-bold'>{cat.name}</span>
                            <span className='ml-auto'>({formatNumber(cat.qty)})</span>
                            <span>{formatCurrency(cat.price)}</span>
                        </div>
                    )
                })
                // }
            )
        },
    },
    {
        accessorKey: 'ticketsSold',
        header: 'Tickets Sold',
        cell: ({ row }) => {
            const modifiedEvent: SingleEvent & { ticketsSold: Ticket[] | [] } = { ...row.original, ticketsSold: [] };
            return (<div><CountTicketsSoldForEvent event={modifiedEvent} /></div>)
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const event = row.original;

            return (
                <EventsListActionsDropdownMenu event={event} onSuccess={handleSuccess} />
            );
        },
    },
];

function handleSuccess<T, S>(response: T, action: S): void {

}