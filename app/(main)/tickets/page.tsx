"use client";

import React, { useCallback, useEffect } from 'react';
import { DataTableLoading } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import MyTickets from '@/components/dashboard/my-tickets';
import LayoutToggle from '@/components/buttons/layout-toggle';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { Heading } from '@/components/ui/headers';
import { useTitle } from '@/hooks/useTitleContext';

export default function Tickets() {
    const [fallback, setFallback] = React.useState<React.JSX.Element | string>(<DataTableLoading />);
    const [layout, setLayout] = React.useState('table');
    const actor = useAuthenticatedUser();

    return (
        (actor) &&
        <div className='flex flex-col gap-5'>
            <Card>
                <CardHeader>
                    <div className='flex flex-row items-center justify-between'>
                        <div className='ml-auto'>
                            <LayoutToggle callback={setLayout} layout={layout} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='overflow-auto p-5'>
                    <MyTickets 
                        layout={layout}
                        isFilteringEnabled={true} 
                        filterParams={['event_title','name','email','phone','ticketCategory','eventRef']}>

                    </MyTickets>
                </CardContent>
            </Card>
        </div>
    )
}
