import { SummaryCardLoading } from '@/components/dashboard/summary-card';
import { Text } from '@/components/ui/text';
import React from 'react';

export default function LoadingDashboard() {
    return (
        <div className='flex flex-col gap-5'>
            <Text variant='h1'>Dashboard</Text>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 lg:gap-5'>
                <SummaryCardLoading />
                <SummaryCardLoading />
                <SummaryCardLoading />
                <SummaryCardLoading />
            </div>
        </div>
    );
}
