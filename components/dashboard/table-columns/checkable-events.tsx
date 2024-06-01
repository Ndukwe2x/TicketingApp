'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { CaretSortIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<SingleEvent>[] = [
    {
        accessorKey: '_id',
        header: () => <div><Checkbox id='check-all' value='checkall' /></div>,
        cell: ({ row }) => <div><Checkbox name='event' id={ row.getValue('_id') } value={ row.getValue('_id') } /></div>,
    },
    {
        accessorKey: 'title',
        header: () => <div style={{width: '18rem'}}>Title</div>,
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
    }
];


// function copyEventLink (event: SingleEvent) {
//     navigator.clipboard.writeText(
//         `${window.location.origin}/events/${event._id}`
//     );
//     toast('Link copied!', {position: 'top-center'});
// }