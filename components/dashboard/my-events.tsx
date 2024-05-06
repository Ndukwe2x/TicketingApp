"use client";

import React, { HtmlHTMLAttributes } from "react";
// import { Providers } from "@/app/providers";
// import { Api, HttpRequest } from "@/lib/api"
// import { fetchDashboardData } from "@/hooks/FetchDashboardData";
// import axios, { AxiosError } from "axios";
import { User } from "@/lib/logged-user";
// import { usePathname, useRouter, useParams, useSearchParams, ReadonlyURLSearchParams } from "next/navigation";
import { DataTable, DataTableLoading } from "../ui/data-table";
import { decorateEvent, getEvents } from "@/hooks/useGetEvents";
import NoNetwork from "../no-network";
import * as dataTableColumns from "./table-columns/events";
import { DataGrid } from "../ui/data-grid";

const MyEvents: React.FC<HtmlHTMLAttributes<HTMLDivElement> & { layout: string;  isFilteringEnabled: boolean; filterParams: string[] }> = ({layout,  isFilteringEnabled = false, filterParams = [], ...props}) => {
    const user = User;
    const [events, setEvents] = React.useState([]);
    const [featuredEvents, setFeaturedEvents] = React.useState([]);
    const [fallback, setFallback] = React.useState<React.JSX.Element | string>(<DataTableLoading />);
    const dataGridColumns: [] = [];

    React.useEffect(() => {
        async function fetchAndDecorateEvents() {
            try {
                const response = await getEvents(User);
                if (response && response.data) {
                    const fetchedEvents = response.data.events || [];
                    const decoratedEvents = await Promise.all(
                        fetchedEvents.map(decorateEvent)
                    );
                    setEvents(decoratedEvents);
                    setFeaturedEvents(
                        decoratedEvents.filter(event => event.featured)
                    );
                }
            } catch (error) {
                let feedback = (error.code === 'ERR_NETWORK' || !navigator.onLine)  
                    ? <NoNetwork />
                    : `Oops! We're unable to fetch your data right now, please 
                    try refreshing the page`;

                setFallback(feedback);
            }
        }

        fetchAndDecorateEvents();
    }, []);

    // if ( !events.length ) return 'No events to show...';
    
    return (
        layout === 'table' 
        ? <DataTable className="vertical-stripe" columns={ dataTableColumns.columns } data={ events } 
            fallback={ fallback } 
            isFilteringEnabled={ true } 
            filterFields={ filterParams }>
            <colgroup>
                {
                    dataTableColumns.columns.map((column, index) => <col id={ column.id} key={index} />)
                }
            </colgroup>
        </DataTable>
        : <DataGrid columns={dataGridColumns} data={ events } columnCount={4} >
            Sorry, this layout cannot be loaded at the moment.
        </DataGrid>
    )
} 

const ErrorHandler = (error: AxiosError) => {
    console.log(error);
}

export default MyEvents;