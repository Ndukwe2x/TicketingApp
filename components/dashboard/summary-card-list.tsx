import { HiMiniUsers } from 'react-icons/hi2';
import { SummaryCard } from '@/components/dashboard/summary-card';
import React from 'react';
import { MdEvent, MdLibraryBooks } from 'react-icons/md';
import { FaMoneyBills } from 'react-icons/fa6';
import { formatCurrency, formatNumber } from '@/lib/utils';

export function SummaryCardList({ summary }: { summary: DashboardSummary }) {
    const { totalAttendees, totalEvents, totalRevenue, totalOrders } = summary;

    const attendeesSummary = {
        title: 'Total Attendees',
        value: formatNumber(totalAttendees.value),
        label: totalAttendees.label,
        icon: <HiMiniUsers />,
    };

    const eventsSummary = {
        title: 'Total Events',
        value: formatNumber(totalEvents.value),
        label: totalEvents.label,
        icon: <MdEvent />,
    };

    const revenueSummary = {
        title: 'Total Sales',
        value: formatCurrency(totalRevenue.value),
        label: totalRevenue.label,
        icon: <FaMoneyBills />,
    };

    const ordersSummary = {
        title: 'Total Orders',
        value: formatNumber(totalOrders.value),
        label: totalOrders.label,
        icon: <MdLibraryBooks />,
    };

    return (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 lg:gap-5'>
            <SummaryCard summary={revenueSummary} />
            <SummaryCard summary={eventsSummary} />
            <SummaryCard summary={ordersSummary} />
            <SummaryCard summary={attendeesSummary} />
        </div>
    );
}
