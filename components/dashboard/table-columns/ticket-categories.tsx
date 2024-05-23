'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { toast } from '@/components/ui/sonner';
import EditEventButton from '@/components/buttons/edit-event-button';
import { User } from '@/lib/logged-user';
import { MdLink } from 'react-icons/md';

export const ticketCategoryColumns: ColumnDef<TicketCategory>[] = [
    {
        accessorKey: 'name',
        header: () => <div>Category</div>,
        cell: ({ row }) => <span>{ row.getValue('name') }</span>
    },
    {
        accessorKey: 'price',
        header: () => <div>Price</div>,
        cell: ({ row }) => <span>{ formatCurrency(Number(row.getValue('price'))) }</span>
    },
    {
        accessorKey: 'qty',
        header: () => <div>Quantity</div>,
        cell: ({ row }) => <span>{ formatNumber(row.getValue('qty')) }</span>
    },
    {
        accessorKey: 'discount',
        header: () => <div>Discount</div>,
        cell: ({ row }) => <span>{ row.getValue('discount') }</span>
    }
];
