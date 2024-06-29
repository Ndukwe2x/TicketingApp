'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { humanReadableDateFormat } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Avatar from '@/components/profile/avatar';
import Link from 'next/link';
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
        cell: ({ row }) => (<RenderUserNameWithLinkBasedOnUserType user={row.original} />),
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
        header: 'Total Events',
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
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (<UsersListActionsDropdownMenu user={row.original} />),
    },
];

const RenderUserNameWithLinkBasedOnUserType = ({ user }: { user: AppUser }) => {
    const actor = useAuthenticatedUser();

    return (
        <div className='capitalize'>
            <Link href={(actor?.isOwner ? '/users/' : '/team/') + user.id}>{user.firstname} {user.lastname}</Link>
        </div>
    )
}