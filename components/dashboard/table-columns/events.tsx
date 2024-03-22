'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CaretSortIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/lib/utils';

export const columns: ColumnDef<DashboardEvent>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => <div className='capitalize'>{row.getValue('title')}</div>,
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
        accessorKey: 'venue',
        header: 'Venue',
        cell: ({ row }) => <div>{row.getValue('venue')}</div>,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <div
                    className='flex gap-2 items-center cursor-pointer'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Date/Time
                    <CaretSortIcon className='ml-2 h-4 w-4' />
                </div>
            );
        },
        cell: ({ row }) => <div>{formatDate(row.getValue('date'), 'MMM DD YYYY, hh:mm A')}</div>,
    },
    {
        accessorKey: 'totalTickets',
        header: 'Total Tickets',
        cell: ({ row }) => <div>{row.getValue('totalTickets')}</div>,
    },
    {
        accessorKey: 'ticketsSold',
        header: 'Tickets Sold',
        cell: ({ row }) => <div>{row.getValue('ticketsSold')}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const event = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <DotsVerticalIcon className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    `${window.location.origin}/events/${event.objectId}`
                                )
                            }
                        >
                            Copy Event Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
