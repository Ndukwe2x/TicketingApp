"use client";

import React, { HtmlHTMLAttributes } from "react";
import { DataTable, DataTableLoading } from "../ui/data-table";
import { useGetEvents, useGetEventsByIds, useGetEventsByUser } from "@/hooks/useGetEvents";
import NoNetwork from "../no-network";
import * as dataTableColumns from "./table-columns/events";
import { DataGrid } from "../ui/data-grid";
import InternalErrorPage from "@/app/internal-error";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { AxiosError } from "axios";
import EventGridTemplate from "./grid-data-templates/event";

const MyEvents: React.FC<HtmlHTMLAttributes<HTMLDivElement> & { 
    layout: string;  
    isFilteringEnabled: boolean; 
    filterParams: string[];
    owner?: AppUser | UserInfo | null;
}> = ({layout,  isFilteringEnabled = false, filterParams = [], owner = null, ...props}) => {
    const actor = useAuthenticatedUser();
    const dataGridColumns: [] = [];
    owner = owner ?? actor;
    
    const [isLoading, events, error] = useGetEventsByUser(owner, actor);
    
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
            : <DataGrid Template={EventGridTemplate} data={ events } columnRule={ {sm: 2, md: 2, lg: 3, xl: 3} } fallback="Loading..." />
        )
    )
} 

// const ErrorHandler = (error: AxiosError) => {
//     console.log(error);
// }

export default MyEvents;