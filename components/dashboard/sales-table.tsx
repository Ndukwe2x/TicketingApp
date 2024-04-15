import React from 'react';
import { columns } from '@/components/dashboard/table-columns/sales';
import { DataTable } from '@/components/ui/data-table';
import { getDashboardSales } from '@/hooks/useGetDashboard';

export async function SalesTable() {
    const sales = await getDashboardSales();

    return <DataTable data={sales} columns={columns} />;
}
