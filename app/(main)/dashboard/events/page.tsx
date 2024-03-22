"use client";

import React from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { getDashboardEvents } from '@/hooks/useGetDashboard';
import { columns } from '@/components/dashboard/table-columns/events';


export default async function Events() {
    const [result, setResult] = React.useState({});
    const [events, setEvents] = React.useState([])

    React.useEffect(() => {
        getDashboardEvents().then((res) => {
            setResult(res)
        });
        return;
    }, []);

    if (result.length && typeof result.data.events !== 'undefined') {
        setEvents(result.data.events);
    }

    return (
        <div className='flex flex-col gap-5'>
            <Text variant='h1'>Events</Text>
            <Card>
                <CardContent className='pt-5'>

                    <DataTable columns={columns} data={events} fallback="There are no events to show..." />
                </CardContent>
            </Card>
        </div>
    );
}
