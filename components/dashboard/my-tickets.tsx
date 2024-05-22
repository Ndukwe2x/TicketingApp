"use client";

import React, { HtmlHTMLAttributes } from "react";
import { Api } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { User } from "@/lib/logged-user";
import { getEventAssociatedToTicket, useGetEventTickets } from "@/hooks/useGetEvents";
import NoNetwork from "../no-network";
import { DataTable, DataTableLoading } from "../ui/data-table";
import { DataGrid } from "../ui/data-grid";
import * as dataTableColumns from "./table-columns/sales";
import InternalErrorPage from "@/app/internal-error";

const MyTickets: React.FC<HtmlHTMLAttributes<HTMLDivElement> & { layout: string;  isFilteringEnabled: boolean; filterParams: string[] }> = ({children, layout,  isFilteringEnabled = false, filterParams = [], ...props}) => {
    const [fallback, setFallback] = React.useState<React.JSX.Element | string>(<DataTableLoading />);
    const user = User;
    const dataGridColumns: [] = [];
    const [tickets, error] = useGetEventTickets( User );
    // const [ticketsWithAssoc, ticketAssocError] = 
    
    

    // React.useEffect(() => {
    //     const fetchTickets = async () => {
    //         try {
                
    //             if (fetchedTickets.length) {
    //                 const decoratedTickets = await Promise.all(
    //                     fetchedTickets.map((ticket) => getEventAssociatedToTicket(ticket, user))
    //                 );
    //                 const filteredTickets = decoratedTickets
    //                 .filter(ticket => ticket.event != null)
    //                 .map(ticket => ({...ticket, event_title: ticket.event.title}));
                    
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
    // }, [initialTickets]);

    if (error instanceof AxiosError) {
        if (error.status == 403) {

        }
        // setFallback(<InternalErrorPage />);
    }
    
    return (
        layout === 'table' 
        ? <DataTable className="vertical-stripe" columns={ dataTableColumns.columns } data={ tickets } 
            fallback={ fallback } 
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