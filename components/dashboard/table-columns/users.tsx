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
import generateRandomString from '@/lib/random-string-generator';


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
        cell: ({ row }) => {
            const menuReference = 'user-' + generateRandomString(32, 'alphanumeric', false);
            return (
                <UsersListActionsDropdownMenu
                    id={menuReference}
                    user={row.original}
                    onBeforeAction={(action) => handleBeforeAction(action, menuReference)}
                    onActionSuccess={(data, action) => handleActionSuccess(data, action, menuReference)}
                    onActionFailure={(action, error) => handleActionFailure(action, menuReference, error)}
                />
            )
        },
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

function handleBeforeAction(action: string, menuId: string): boolean {
    switch (action) {
        case 'delete':
            const row = document.querySelector(`#${menuId}`)?.closest('tr');
            if (row) {
                row.classList.add('pending-delete');
            }
            return true;

        default:
            break;
    }

    return false;
}

function handleActionSuccess(response: any, action: string, menuId: string): void {
    switch (action) {
        case 'delete':
            const row = document.querySelector(`#${menuId}`)?.closest('tr');
            const popper = document.querySelector('[data-radix-popper-content-wrapper]');
            if (!row) {
                return;
            }
            new Promise((resolve, reject) => {
                row.classList.remove('pending-delete');
                row.classList.add('deleted');
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            }).then(() => {
                row.remove();
                // popper?.setAttribute('style', 'display: none');
                // popper?.remove();
                // document.body.removeAttribute('data-scroll-locked');
                // document.body.style.pointerEvents = 'auto';
            });
            break;

        default:
            break;
    }
}

function handleActionFailure(action: string, menuId: string, error?: Error | unknown): void {
    switch (action) {
        case 'delete':
            const row = document.querySelector(`#${menuId}`)?.closest('tr');
            if (!row) {
                return;
            }
            row.classList.remove('pending-delete');
            break;

        default:
            break;
    }
}