"use client";

import React from 'react';
// import { columns } from '@/components/dashboard/table-columns/sales';
import { DataTableLoading } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { User } from '@/lib/logged-user';
import { Text } from '@/components/ui/text';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { getURL } from 'next/dist/shared/lib/utils';
// import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
// import { getEventTickets, useGetEventById, getEventAssociatedToTicket } from '@/hooks/useGetEvents';
// import NoNetwork from '@/components/no-network';
// import MyEvents from '@/components/dashboard/my-events';
import MyTickets from '@/components/dashboard/my-tickets';
import LayoutToggle from '@/components/buttons/layout-toggle';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { Heading } from '@/components/ui/headers';

export default function Tickets() {
    const [fallback, setFallback] = React.useState<React.JSX.Element | string>(<DataTableLoading />);
    const [layout, setLayout] = React.useState('table');
    const actor = useAuthenticatedUser();

    return (
        (actor) &&
        <div className='flex flex-col gap-5'>
            <Heading variant='h1' className='page-title'>{ actor?.isUser && 'My '}Tickets</Heading>

            {/* <SummaryCardList summary={summary} /> */}

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
