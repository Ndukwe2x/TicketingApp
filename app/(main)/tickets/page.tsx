"use client";

import React, { Suspense } from 'react';
import { columns } from '@/components/dashboard/table-columns/sales';
import { DataTable, DataTableLoading } from '@/components/ui/data-table';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { getDashboardSales } from '@/hooks/useGetDashboard';
import axios, { AxiosError } from 'axios';
import { Api, HttpRequest } from '@/lib/api';
import { fetchDashboardData } from '@/hooks/FetchDashboardData';
import { User } from '@/lib/logged-user';
import { Text } from '@/components/ui/text';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getURL } from 'next/dist/shared/lib/utils';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';

export default function Tickets() {
    const [apiResponse, setApiResponse] = React.useState(null);
    const [tickets, setTickets] = React.useState([]);
    const user = User();
    // const router = useRouter();
    // const uri = getURL();
    // const params = parseUrl(uri);

    React.useEffect(() => {
        const url = user.user.userStatus === 'owner'
            ? Api.server + Api.endpoints.admin.tickets
            : Api.server + Api.endpoints.public.tickets;

        try {
            const response = axios.get(url, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            response.then((result) => {
                setApiResponse(result.data);
                if (result.data.data.tickets) {
                    setTickets(result.data.data.tickets);
                }
            })
            .catch((rejection) => {
                if (rejection.code === 'ERR_NETWORK') {
                    // Alert the user that their network connection was lost.
                }
            })
            
        } catch (error) {
            console.log(error)
        }

        return;
    }, []);

    // return <DataTable data={sales} columns={columns} />;
    return (
        <div className='flex flex-col gap-5'>
            <Text variant='h1'>Tickets</Text>

            {/* <SummaryCardList summary={summary} /> */}

            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <Text variant='h3'>Sales</Text>
                </CardHeader>
                <CardContent className='overflow-auto'>
                    <Suspense fallback={<DataTableLoading />}>
                        <DataTable columns={columns} data={ tickets } fallback='Nothing to show.' />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
