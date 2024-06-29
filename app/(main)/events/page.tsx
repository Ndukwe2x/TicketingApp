"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MyEvents from '@/components/dashboard/my-events';
import ToggleView from '@/components/buttons/viewtype-toggle';


export default function Events() {
    const [layout, setLayout] = useState('list');

    return (
        // (actor) &&
        <div className='flex flex-col gap-5'>
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    {/* <Text variant='h4'>Events</Text> */}
                    <div className='flex flex-row self-end items-center justify-between'>
                        <ToggleView setExternalViewType={setLayout} dataSetId='events' />
                    </div>
                </CardHeader>
                <CardContent className='p-5'>
                    <MyEvents
                        layout={layout}
                        isFilteringEnabled={true}
                        filterParams={['title', 'state', 'city', 'address', 'date']} />
                </CardContent>
            </Card>
        </div>
    )
}

