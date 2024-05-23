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
import { formatDate, formatNumber, humanReadableDateFormat } from '@/lib/utils';
import { Icons } from '@/components/icons';
// import styles from '@/components/styles/styles.module.css';
import Avatar from '@/components/profile/avatar';
import Link from 'next/link';
import DeleteUserButton from '@/components/buttons/delete-user-button';
import { User } from '@/lib/logged-user';
import EditUserButton from '@/components/buttons/edit-user-button';
import CreateEventForUser from '@/components/buttons/create-event-for-user';
import { MdPerson } from 'react-icons/md';


export const columns: ColumnDef<AppUser>[] = [
    {
        accessorKey: 'avatar',
        header: () => {
            return <Icons.user />
        },
        cell: ({ row }) => <div className='capitalize'>
            <Avatar user={row.original} size={ 45 } />
        </div>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div className='capitalize'>
                <Link href={ '/users/' + row.original.id }>{row.original.firstname} {row.original.lastname}</Link>
            </div>,
    },
    // {
    //     accessorKey: 'firstname',
    //     header: 'Firstname',
    //     cell: ({ row }) => <div className='capitalize'>{row.getValue('firstname')}</div>,
    // },
    // {
    //     accessorKey: 'lastname',
    //     header: 'Lastname',
    //     cell: ({ row }) => <div className='capitalize'>{row.getValue('lastname')}</div>,
    // },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <div className='capitalize'>{row.getValue('phone')}</div>,
    },
    // {
    //     accessorKey: 'accountType',
    //     header: ({ column }) => {
    //         return (
    //             <div
    //                 className='flex gap-2 items-center cursor-pointer'
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 Account Type
    //                 <CaretSortIcon className='ml-2 h-4 w-4' />
    //             </div>
    //         );
    //     },
    //     cell: ({ row }) => <div className='capitalize'>{row.getValue('accountType') }</div>,
    // },
    // {
    //     accessorKey: 'userStatus',
    //     header: ({ column }) => {
    //         return (
    //             <div
    //                 className='flex gap-2 items-center cursor-pointer'
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 User Status
    //                 <CaretSortIcon className='ml-2 h-4 w-4' />
    //             </div>
    //         );
    //     },
    //     cell: ({ row }) => {
    //         const status = row.getValue('userStatus') as UserInfo['userStatus'];

    //         return (
    //             <div className='flex gap-1 flex-wrap'>
    //                 <div
    //                     className={`px-2 py-1 rounded-full text-xs ${
    //                         status === 'active'
    //                             ? 'bg-green-100 text-green-800'
    //                             : 'bg-red-100 text-red-800'
    //                     }`}
    //                 >
    //                     {status}
    //                 </div>
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: 'eventRef',
        header: 'Total Events',
        cell: ({ row }) => <div>{ row.getValue('eventRef').length }</div>,
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <div
                    className='flex gap-2 items-center cursor-pointer'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Date Registered
                    <CaretSortIcon className='ml-2 h-4 w-4' />
                </div>
            );
        },
        cell: ({ row }) => <div>{humanReadableDateFormat(row.getValue('createdAt'))}</div>,
    },
    // {
    //     accessorKey: 'userStatus',
    //     header: 'Account Status',
    //     cell: ({ row }) => {
    //         const status = row.getValue('userStatus') as UserInfo['userStatus'];

    //         return (
    //             <div className='flex gap-1 flex-wrap'>
    //                 <div
    //                     className={`px-2 py-1 rounded-full text-xs ${
    //                         status === 'active'
    //                             ? 'bg-green-100 text-green-800'
    //                             : 'bg-red-100 text-red-800'
    //                     }`}
    //                 >
    //                     {status}
    //                 </div>
    //             </div>
    //         );
    //     },
    // },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;

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
                            <Link href={ '/users/' + user.id } className='flex gap-6 hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full'>Profile <MdPerson size={18} /></Link>
                            <CreateEventForUser actor={ User } user={ user } className='flex gap-6 hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full' />
                        
                            <EditUserButton actor={ User } userId={ user.id } className='flex gap-6 hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full' />
                        <DropdownMenuSeparator />
                            <DeleteUserButton actor={ User } account={ user } className='flex gap-6 hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full text-destructive' />
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
