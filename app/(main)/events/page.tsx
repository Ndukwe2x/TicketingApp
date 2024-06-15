"use client";

import * as React from 'react';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { decorateEvent, getEvents } from '@/hooks/useGetEvents';
import { DataTable, DataTableLoading } from '@/components/ui/data-table';
import { columns } from '@/components/dashboard/table-columns/events';
import NoNetwork from '@/components/no-network';
import MyEvents from '@/components/dashboard/my-events';
import LayoutToggle from '@/components/buttons/layout-toggle';
import { Heading } from '@/components/ui/headers';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';


export default function Events() {
    const [layout, setLayout] = React.useState('table');
    const actor = useAuthenticatedUser();

    return (
        (actor) && 
        <div className='flex flex-col gap-5'>
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    {/* <Text variant='h4'>Events</Text> */}
                    <div className='flex flex-row self-end items-center justify-between'>
                        <LayoutToggle callback={setLayout} layout={layout} />
                    </div>
                </CardHeader>
                <CardContent className='p-5'>
                    <MyEvents 
                    layout={layout}
                    isFilteringEnabled={true} 
                    filterParams={['id', 'title', 'state', 'city', 'address', 'date']} />
                </CardContent>
            </Card>
        </div>
    )
}

