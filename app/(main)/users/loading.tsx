import { DataTableLoading } from '@/components/ui/data-table';
import { Text } from '@/components/ui/text';
import React from 'react';

export default function LoadingDashboardUsers() {
    return (
        <div className='flex flex-col gap-5'>
            <DataTableLoading showHeader={true} columnCount={6} />
        </div>
    );
}
