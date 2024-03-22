import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex relative'>
            <DashboardNav />
            <div className='flex-1 pl-3 lg:pl-10 overflow-y-auto pb-10'>{children}</div>
        </div>
    );
}
