"use client";

import React, { HtmlHTMLAttributes, useState } from "react";
import { DataTable, DataTableLoading } from "../ui/data-table";
import { useGetEvents, useGetEventsByIds, useGetEventsByUser } from "@/hooks/useGetEvents";
import NoNetwork from "../no-network";
import * as dataTableColumns from "./table-columns/events";
import { DataGrid } from "../ui/data-grid";
import InternalErrorPage from "@/app/internal-error";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import EventGridTemplate from "./grid-data-templates/event";
import { orderByDate } from "@/lib/utils";
import { APPCONFIG } from "@/lib/app-config";

const MyEvents: React.FC<HtmlHTMLAttributes<HTMLDivElement> & { 
    layout: string;  
    isFilteringEnabled: boolean; 
    filterParams: string[];
    owner?: AppUser | UserInfo | null;
}> = ({layout,  isFilteringEnabled = false, filterParams = [], owner = null, ...props}) => {
    const actor = useAuthenticatedUser();
    owner = owner ?? actor;
    const {maxItemsPerPage = 10} = APPCONFIG.paginationOptions;
    
    const [isLoading, rawEvents, error] = useGetEventsByUser(owner as AppUser, actor as AppUser);
    const [events, setEvents] = useState<SingleEvent[] | []>([]);

    React.useEffect(() => {
        if (rawEvents.length) {
            const orderedByDate: Record<string, string>[] = orderByDate((rawEvents as unknown) as any);
            setEvents((orderedByDate as unknown) as SingleEvent[]);
        }
    }, [rawEvents]);
    
    if ( error?.code ) {
        if ( ['ERR_NETWORK','ECONNABORTED'].includes(error.code) ) {
            return <NoNetwork />
        } else {
            return <InternalErrorPage />
        }
    } else if ( events.length < 1 && !isLoading ) {
        return <div className="text-center">No events to show.</div>;
    }
    
    return (
        (
            layout === 'table' 
            ? <DataTable className="vertical-stripe" columns={ dataTableColumns.columns } data={ events } 
                fallback={ <DataTableLoading /> } 
                isFilteringEnabled={ true } 
                filterFields={ filterParams }>
                <colgroup>
                    {
                        dataTableColumns.columns.map((column, index) => <col id={ column.id} key={index} />)
                    }
                </colgroup>
            </DataTable>
            : <DataGrid Template={EventGridTemplate} data={ events } columnRule={ {sm: 2, md: 2, lg: 3, xl: 3} } paginationOptions={{ itemsPerPage: maxItemsPerPage }} fallback="Loading... Please wait" />
        )
    )
} 


export default MyEvents;