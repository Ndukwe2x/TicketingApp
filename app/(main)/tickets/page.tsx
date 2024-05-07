"use client";

import React from 'react';
import { columns } from '@/components/dashboard/table-columns/sales';
import { DataTable, DataTableLoading } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User } from '@/lib/logged-user';
import { Text } from '@/components/ui/text';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getURL } from 'next/dist/shared/lib/utils';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import { getEventTickets, getEventById, getEventAssociatedToTicket } from '@/hooks/useGetEvents';
import NoNetwork from '@/components/no-network';
import MyEvents from '@/components/dashboard/my-events';
import MyTickets from '@/components/dashboard/my-tickets';
import LayoutToggle from '@/components/buttons/layout-toggle';

export default function Tickets() {
    const [fallback, setFallback] = React.useState<React.JSX.Element | string>(<DataTableLoading />);
    const [layout, setLayout] = React.useState('');
    const user = User;

    // React.useEffect(() => {
    //     const fetchTickets = async () => {
    //         try {
    //             const fetchedTickets: [] = await getEventTickets( User );
                
    //             if (fetchedTickets.length) {
    //                 const decoratedTickets = await Promise.all(
    //                     fetchedTickets.map((ticket) => getEventAssociatedToTicket(ticket, user))
    //                 );
    //                 const filteredTickets = decoratedTickets.filter(ticket => ticket.event != null);
                    
    //                 setTickets(filteredTickets);
    //             }
    //         } catch (error) {
    //             let errorMsg = (error.code === 'ERR_NETWORK' || !navigator.onLine) 
    //                 ? <NoNetwork />
    //                 : 'Oops! Something went wrong. We are unable to fetch your tickets at the moment.';

    //             setFallback(errorMsg);
    //         }
    //     }

    //     fetchTickets();
    // }, []);

    // return <DataTable data={sales} columns={columns} />;
    return (
        <div className='flex flex-col gap-5'>
            <Text variant='h1' className='page-title'>Tickets</Text>

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
