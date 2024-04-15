'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { formatCurrency, formatDate, humanReadableDateFormat } from '@/lib/utils';
// import CommonDropdownMenu from '@/components/dropdown-menu';
// import { Icons } from '@/components/icons';
import { User } from '@/lib/logged-user';
// import * as TicketActions from '@/hooks/ticket-actions';
// import Modal from '@/components/ui/modal';
import TicketActionsDropdownMenu from '../ticket-actions-dropdown-menu';

export const columns: ColumnDef<Ticket>[] = [
    {
        accessorKey: '_id',
        header: 'ID.',
        cell: ({ row }) => <div className='underline'>{row.getValue('_id')}</div>,
    },
    {
        accessorKey: 'eventRef',
        header: 'Event Ref.',
        cell: ({ row }) => <div className='underline'>{row.getValue('eventRef')}</div>,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <div
                    className='flex gap-2 items-center cursor-pointer'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Customer
                    <CaretSortIcon className='ml-2 h-4 w-4' />
                </div>
            );
        },
        cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
        accessorKey: 'dateOfPurchase',
        header: ({ column }) => {
            return (
                <div
                    className='flex gap-2 items-center cursor-pointer'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Purchase Date
                    <CaretSortIcon className='ml-2 h-4 w-4' />
                </div>
            );
        },
        cell: ({ row }) => (
            <div style={{whiteSpace: "nowrap"}}>{humanReadableDateFormat(row.getValue('dateOfPurchase'))}</div>
        ),
    },
    {
        accessorKey: 'ticketCategory',
        header: () => <div className='capitalize whitespace-nowrap'>Ticket Category</div>,
        cell: ({ row }) => <div>{row.getValue('ticketCategory')}</div>,
    },
    {
        accessorKey: 'amountPaid',
        header: 'Amount Paid',
        cell: ({ row }) => <div>{formatCurrency(row.getValue('amountPaid'))}</div>,
    },
    {
        accessorKey: 'numberOfTickets',
        header: 'Number of Tickets',
        cell: ({ row }) => <div>{row.getValue('numberOfTickets')}</div>,
    },
    {
        accessorKey: 'referenceNo',
        header: 'Reference No',
        cell: ({ row }) => <div>{row.getValue('referenceNo')}</div>,
    },
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

const user = User();

if (user && user.user.userStatus &&  'user') {
    columns.push({
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return (<TicketActionsDropdownMenu row={ row } />)}
    })
}

