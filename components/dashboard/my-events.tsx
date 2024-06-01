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
        if ( error.code == 'ERR_NETWORK' ) {
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
            : <DataGrid columns={dataGridColumns} data={ events } columnCount={4} >
                Sorry, this layout cannot be loaded at the moment.
            </DataGrid>
        )
    )
} 

// const ErrorHandler = (error: AxiosError) => {
//     console.log(error);
// }

export default MyEvents;