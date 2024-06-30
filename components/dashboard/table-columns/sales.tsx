'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { cn, formatCurrency, humanReadableDateFormat } from '@/lib/utils';
import Link from 'next/link';
import SendTicketToCustomer from '@/components/buttons/ticket/resend-ticket';
import DeleteTicket from '@/components/buttons/ticket/delete-ticket';
import { FiEye } from 'react-icons/fi';
import { title } from 'process';


export const columns: ColumnDef<Ticket>[] = [
    {
        accessorKey: 'event_title',
        header: () => <div className='px-4'>Event</div>,
        cell: ({ row }) => (<div className='whitespace-nowrap'>
            <Link href={`${location.origin}/events/${row.original._id}`}>
                {row.getValue('event_title')}
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
            const ticket = row.original;

            return (
                <div id={`ticket_${ticket._id}`} className='flex gap-3 items-center justify-between px-2'>
                    <Link href={`/tickets/${ticket.referenceNo}/`}
                        className={cn('border border-primary flex flex-row gap-1.5 hover:bg-primary',
                            'hover:text-primary-foreground md:px-2 md:py-1 px-1.5 py-1 h-9',
                            'rounded-md text-primary whitespace-nowrap shadow items-center')}>
                        <span className='sr' aria-description='View ticket'>View</span>
                        <FiEye size={20} />
                    </Link>
                    <SendTicketToCustomer ticketId={ticket._id} variant={null}
                        className={cn('border flex flex-row gap-1.5 bg-white hover:bg-secondary',
                            'hover:text-secondary-foreground items-center md:px-2 md:py-1 px-1.5 py-1 ',
                            'rounded-md text-foreground whitespace-nowrap')}>
                        <span className='sr' aria-description='Send ticket to customer'>Send</span>
                    </SendTicketToCustomer>
                    <DeleteTicket ticketId={ticket._id}
                        onPending={() => handlePendingDeleteState(`#ticket_${ticket._id}`)}
                        onSuccess={data => handleDeleteSuccessStat(data, `#ticket_${ticket._id}`)}
                        onFailure={error => handleDeleteFailure(error, `#ticket_${ticket._id}`)}
                        variant={null}
                        className={cn('border border-destructive flex flex-row gap-1.5 bg-destructive',
                            'hover:bg-accent-destructive text-white items-center md:px-2 md:py-1 px-1.5 py-1 ',
                            'rounded-md text-white whitespace-nowrap')}>
                        <span className='sr' aria-description='Delete Ticket'>Delete</span>
                    </DeleteTicket>
                </div>
            )
        }
    }
];

const handlePendingDeleteState = (rowFinder: string) => {
    const row = document.querySelector(rowFinder)?.closest('tr') as HTMLTableRowElement;
    if (!row) {
        return;
    }
    row.style.background = '#ff000047';
    row.ariaDisabled = 'true';
}

const handleDeleteSuccessStat = (data: any, rowFinder: string) => {
    const row = document.querySelector(rowFinder)?.closest('tr');
    if (!row) {
        return;
    }

    row?.remove();
}

const handleDeleteFailure = (error: any, rowFinder: string) => {
    const row = document.querySelector(rowFinder)?.closest('tr') as HTMLTableRowElement;
    if (!row) {
        return;
    }
    row.style.background = '';
    row.ariaDisabled = 'false';
}

