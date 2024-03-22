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

export const columns: ColumnDef<DashboardAttendees>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>,
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
        accessorKey: 'totalEvents',
        header: 'Total Events',
        cell: ({ row }) => <div>{row.getValue('totalEvents')}</div>,
    },
    {
        accessorKey: 'status',
        header: 'Account Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as DashboardAttendees['status'];

            return (
                <div className='flex gap-1 flex-wrap'>
                    <div
                        className={`px-2 py-1 rounded-full text-xs ${
                            status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {status}
                    </div>
                </div>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const attendee = row.original;

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
                        {/*<DropdownMenuSeparator />*/}
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
