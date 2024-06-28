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
import Avatar from '@/components/profile/avatar';
import Link from 'next/link';
import DeleteUserButton from '@/components/buttons/delete-user-button';
import EditUserButton from '@/components/buttons/edit-user-button';
import CreateEventForUser from '@/components/buttons/create-event-for-user';
import { MdPerson } from 'react-icons/md';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';


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
        cell: ({ row }) => {
            const actor = useAuthenticatedUser();
            return (
                <div className='capitalize'>
                    <Link href={(actor?.isOwner ? '/users/' : '/team/') + row.original.id}>{row.original.firstname} {row.original.lastname}</Link>
                </div>
            )
        },
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
        cell: ({ row }) => {
            const user = row.original;
            const actor = useAuthenticatedUser() as AppUser;
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
                        <Link href={'/users/' + user.id} className='flex gap-6 hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full'>Profile <MdPerson size={18} /></Link>
                        <CreateEventForUser variant={null} actor={actor} user={user} className='flex gap-6 text-foreground hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full' />

                        <EditUserButton variant={null} actor={actor} userId={user.id} className='flex gap-6 text-foreground hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full' />
                        <DropdownMenuSeparator />
                        <DeleteUserButton actor={actor} account={user} className='flex gap-6 hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full text-destructive' />

                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
