'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { formatCurrency, formatDate, humanReadableDateFormat } from '@/lib/utils';
import { User } from '@/lib/logged-user';
import TicketActionsDropdownMenu from '../ticket-actions-dropdown-menu';
import Link from 'next/link';
import TicketEvent from '../ticket-event';

export const columns: ColumnDef<Ticket & {event: SingleEvent | null; event_title: string | null}>[] = [
    {
        accessorKey: 'event_title',
        header: () => <div className='px-4'>Event</div>,
        cell: ({ row }) => (<div className='whitespace-nowrap'>
                {/* <TicketEvent key={ row.id } actor={ User } ticket={ row.original } /> */}
            <Link href={ `${location.origin}/events/${row.original._id}`}>
                { row.getValue('event_title')}
            </Link>
        </div>),
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <div
                    className='flex gap-2 items-center cursor-pointer px-4'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Customer
                    <CaretSortIcon className='ml-2 h-4 w-4' />
                </div>
            );
        },
        cell: ({ row }) => <div className='capitalize px-4 whitespace-nowrap bold'>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'email',
        header: () => <div className='px-4'>Email</div>,
        cell: ({ row }) => <div className='px-4'>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <div className='px-4'>{row.getValue('phone')}</div>,
    },
    {
        accessorKey: 'dateOfPurchase',
        header: ({ column }) => {
            return (
                <div
                    className='flex gap-2 items-center cursor-pointer px-4'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Purchase Date
                    <CaretSortIcon className='ml-2 h-4 w-4' />
                </div>
            );
        },
        cell: ({ row }) => (
            <div className='whitespace-nowrap px-4'>{humanReadableDateFormat(row.getValue('dateOfPurchase'))}</div>
        ),
    },
    {
        accessorKey: 'ticketCategory',
        header: () => <div className='whitespace-nowrap px-4'>Ticket Category</div>,
        cell: ({ row }) => <div className='px-4'>{row.getValue('ticketCategory')}</div>,
    },
    {
        accessorKey: 'amountPaid',
        header: () => <div className='whitespace-nowrap px-4'>Amount Paid</div>,
        cell: ({ row }) => <div className='px-4'>{formatCurrency(row.getValue('amountPaid'))}</div>,
    },
    {
        accessorKey: 'numberOfTickets',
        header: () => <div className='whitespace-nowrap px-4'>Number of Tickets</div>,
        cell: ({ row }) => <div className='px-4'>{row.getValue('numberOfTickets')}</div>,
    },
    {
        accessorKey: 'referenceNo',
        header: 'Reference No',
        cell: ({ row }) => <div>{row.getValue('referenceNo')}</div>,
    },
    {
        accessorKey: 'actions',
        cell: ({ row }) => {
            return (
                <div className='text-right'>
                    <Link href={`/tickets/${row.original.referenceNo}/`} className='border border-primary flex flex-row hover:bg-primary 
                hover:text-primary-foreground items-end gap-1.5 py-1 px-1 md:px-2 lg:px-4 rounded-full text-primary whitespace-nowrap'>View Ticket</Link>
                </div>
            )
        }
    }
    // {
    //     accessorKey: 'dueDate',
    //     header: ({ column }) => {
    //         return (
    //             <div
    //                 className='flex gap-2 items-center cursor-pointer'
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 Due Date
    //                 <CaretSortIcon className='ml-2 h-4 w-4' />
    //             </div>
    //         );
    //     },
    //     cell: ({ row }) => <div>{formatDate(row.getValue('dueDate'), 'MMM DD YYYY, hh:mm A')}</div>,
    // },
    // {
    //     accessorKey: 'admitted',
    //     header: 'Admitted',
    //     cell: ({ row }) => <div>{row.getValue('admitted') ? 'Yes' : 'No'}</div>,
    // },
];

// const user = User;

// if (user && user.user.userStatus &&  'user') {
//     columns.push({
//         accessorKey: 'actions',
//         cell: ({ row }) => {
//             return (<div className='text-right px-4'><TicketActionsDropdownMenu row={ row } /></div>)}
//     })
// }

