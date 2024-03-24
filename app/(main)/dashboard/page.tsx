"use client";

import { Suspense } from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SummaryCardList } from '@/components/dashboard/summary-card-list';
import { getDashboardSummary } from '@/hooks/useGetDashboard';
import { SalesTable } from './sales-table';
import { DataTableLoading } from '@/components/ui/data-table';
import { AddTicket } from '@/components/dashboard/add-ticket';
import { AddCategory } from '@/components/dashboard/add-category';


export default async function Dashboard() {

    return (
        <div className='flex flex-col gap-5'>
            <Text variant='h1'>Dashboard</Text>

            {/* <SummaryCardList summary={summary} /> */}

            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <Text variant='h4'>Sales</Text>
                    <AddCategory />
                </CardHeader>
                <CardContent className='overflow-auto'>
                    <Suspense fallback={<DataTableLoading />}>
                        <SalesTable />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
