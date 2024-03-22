'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { formatCurrency, formatDate } from '@/lib/utils';

export const columns: ColumnDef<DashboardSales>[] = [
    {
        accessorKey: 'referenceNo',
        header: 'Reference No.',
        cell: ({ row }) => <div className='underline'>{row.getValue('referenceNo')}</div>,
    },
    {
        accessorKey: 'customer',
        header: 'Customer',
        cell: ({ row }) => <div className='capitalize'>{row.getValue('customer')}</div>,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => <div>{row.getValue('category')}</div>,
    },
    {
        accessorKey: 'quantity',
        header: 'Quantity',
        cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => <div>{formatCurrency(row.getValue('amount'))}</div>,
    },
    {
        accessorKey: 'purchaseDate',
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
            <div>{formatDate(row.getValue('purchaseDate'), 'MMM DD YYYY, hh:mm A')}</div>
        ),
    },
    {
        accessorKey: 'dueDate',
        header: ({ column }) => {
            return (
                <div
                    className='flex gap-2 items-center cursor-pointer'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Due Date
                    <CaretSortIcon className='ml-2 h-4 w-4' />
                </div>
            );
        },
        cell: ({ row }) => <div>{formatDate(row.getValue('dueDate'), 'MMM DD YYYY, hh:mm A')}</div>,
    },
    {
        accessorKey: 'admitted',
        header: 'Admitted',
        cell: ({ row }) => <div>{row.getValue('admitted') ? 'Yes' : 'No'}</div>,
    },
];
