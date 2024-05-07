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
import { Text } from '@/components/ui/text';

export const columns: ColumnDef<SingleEvent>[] = [
    {
        accessorKey: 'title',
        header: () => <div style={{width: '18rem'}}>Title</div>,
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
        header: () => <div style={ { width: '12rem' } }>Address</div>,
        cell: ({ row }) => <div>{row.getValue('address')}</div>,
    },
    {
        accessorKey: 'eventDate',
        header: ({ column }) => {
            return (
                <div
                    className='flex gap-2 items-center cursor-pointer'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    style={ { width: '12rem' } }
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
        header: () => <div style={ { width: '16rem' } }>Ticket Categories</div>,
        cell: ({ row }) => {
            return (
                <div className='gap-1.5 grid grid-cols-3 ticket-categories'>
                    {
                        row.original.ticketCategories.map(cat => {
                            return (
                                <div className='category-group'>
                                    <Text variant='p' className='font-bold'>{ cat.name }</Text>
                                    <div variant='p'>N{ cat.price }</div>
                                    <div variant='p'>{ cat.qty }</div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        },
    },
    {
        accessorKey: 'ticketsSold',
        header: 'Tickets Sold',
        cell: ({ row }) => <div>{row.original.ticketsSold.length}</div>,
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
