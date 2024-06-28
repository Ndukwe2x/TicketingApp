import React, { HtmlHTMLAttributes, useCallback, useEffect, useState } from "react";
import { useGetTicketSales } from "@/hooks/useGetEvents";
import { DataTable } from "../ui/data-table";
import { columns } from "./table-columns/sales";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";

const TicketsSoldForEvent: React.FC<HtmlHTMLAttributes<HTMLDivElement> &
{ event: SingleEvent & { ticketsSold: Ticket[] | [] } }> = ({ children, className, event }) => {
    const actor = useAuthenticatedUser();
    const [fallback, setFallback] = useState('Fetching tickets, please wait. This may take a moment...');
    const [isLoading, tickets, error] = useGetTicketSales(actor as AppUser, event);

    useEffect(() => {
        if (error) {
            setFallback('Unable to fetch tickets, something went wrong');
            return;
        }
        if (!isLoading && tickets.length == 0) {
            setFallback('No tickets sold yet...');
        }
    }, [isLoading, tickets]);

    return (
        <DataTable
            columns={columns}
            data={tickets}
            fallback={fallback}
            isFilteringEnabled={true}
            filterFields={['name', 'email', 'phone', 'ticketCategory', 'eventRef']}>
            <colgroup>
                {
                    columns.map((column, index) => <col key={index} />)
                }
            </colgroup>
        </DataTable>
    )
}

export default TicketsSoldForEvent;