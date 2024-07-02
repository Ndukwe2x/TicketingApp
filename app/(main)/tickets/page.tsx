"use client";

import React, { useCallback, useEffect } from 'react';
import { DataTableLoading } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import MyTickets from '@/components/dashboard/my-tickets';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { Heading } from '@/components/ui/headers';
import { useTitle } from '@/hooks/useTitleContext';
import ToggleView from '@/components/buttons/viewtype-toggle';

export default function Tickets() {
    const actor = useAuthenticatedUser();
    const [fallback, setFallback] = React.useState<React.JSX.Element | string>(<DataTableLoading />);
    const [layout, setLayout] = React.useState<ViewType>('list');


    React.useEffect(() => {
        const storedLayout = localStorage.getItem(`viewType_tickets`) || 'list';
        setLayout(storedLayout as ViewType);
    }, [actor]);

    return (
        (actor) &&
        <div className='flex flex-col gap-5'>
            <Card>
                <CardHeader>
                    <div className='flex flex-row items-center justify-between'>
                        <div className='ml-auto'>
                            <ToggleView setExternalViewType={setLayout} dataSetId='tickets' />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='overflow-auto p-5'>
                    <MyTickets
                        layout={layout}
                        isFilteringEnabled={true}
                        filterParams={['event_title', 'name', 'email', 'phone', 'ticketCategory', 'eventRef']}>

                    </MyTickets>
                </CardContent>
            </Card>
        </div>
    )
}
