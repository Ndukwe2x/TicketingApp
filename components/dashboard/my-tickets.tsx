"use client";

import React, { HtmlHTMLAttributes, useEffect } from "react";
import { Api } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { User } from "@/lib/logged-user";
import { getEventAssociatedToTicket, useGetTicketSales } from "@/hooks/useGetEvents";
import NoNetwork from "../no-network";
import { DataTable, DataTableLoading } from "../ui/data-table";
import { DataGrid } from "../ui/data-grid";
import * as dataTableColumns from "./table-columns/sales";
import InternalErrorPage from "@/app/internal-error";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";

const MyTickets: React.FC<HtmlHTMLAttributes<HTMLDivElement> & { layout: string;  isFilteringEnabled: boolean; filterParams: string[] }> = ({children, layout,  isFilteringEnabled = false, filterParams = [], ...props}) => {
    const actor = useAuthenticatedUser();
    const dataGridColumns: [] = [];
    const [isLoading, tickets, error] = useGetTicketSales( actor );

    if ( error?.code ) {
        if ( error.code == 'ERR_NETWORK' ) {
            return <NoNetwork />
        } else {
            return <InternalErrorPage />
        }
    } else if ( tickets.length < 1 && !isLoading ) {
        return <div className="text-center">No tickets to show.</div>;
    }
    
    return (
        layout === 'table' 
        ? <DataTable className="vertical-stripe" columns={ dataTableColumns.columns } data={ tickets }
            fallback={ <DataTableLoading /> } 
            isFilteringEnabled={ true } 
            filterFields={ filterParams }>
            <colgroup>
                {
                    dataTableColumns.columns.map((column, index) => <col key={index} />)
                }
            </colgroup>
        </DataTable>
        : <DataGrid columns={dataGridColumns} data={ tickets } columnCount={4}>
            Sorry, this layout cannot be loaded at the moment
        </DataGrid>
    )
} 

export default MyTickets;