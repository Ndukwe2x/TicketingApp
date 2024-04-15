import { DataTableLoading } from '@/components/ui/data-table';
import { Text } from '@/components/ui/text';
import React from 'react';

export default function LoadingDashboardUsers({columnCount}: {columnCount: number}) {
    return (
        <div className='flex flex-col gap-5'>
            <DataTableLoading columnCount={columnCount} />
        </div>
    );
}
