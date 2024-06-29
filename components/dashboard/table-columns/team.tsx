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
import { humanReadableDateFormat } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Avatar from '@/components/profile/avatar';
import Link from 'next/link';
import DeleteUserButton from '@/components/buttons/delete-user-button';
import EditUserButton from '@/components/buttons/edit-user-button';
import CreateEventForUser from '@/components/buttons/create-event-for-user';
import { MdPerson } from 'react-icons/md';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import UsersListActionsDropdownMenu from '../users-list-actions-dropdown-menu';


export const columns: ColumnDef<AppUser>[] = [
    {
        accessorKey: 'avatar',
        header: () => {
            return <Icons.user />
        },
        cell: ({ row }) => <div className='capitalize'>
            <Avatar user={row.original} size={45} />
        </div>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div className='capitalize'>
            <Link href={'/users/' + row.original.id}>{row.original.firstname} {row.original.lastname}</Link>
        </div>,
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <div className='capitalize'>{row.getValue('phone')}</div>,
    },
    {
        accessorKey: 'eventRef',
        header: 'Events',
        cell: ({ row }) => <div>{row.original.eventRef.length}</div>,
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
        cell: ({ row }) => (<UsersListActionsDropdownMenu user={row.original} />),
    },
];
