import React, { HtmlHTMLAttributes, useCallback, useEffect, useState } from "react";
import { useGetTicketSales } from "@/hooks/useGetEvents";
import { User } from "@/lib/logged-user";
import { DataTable } from "../ui/data-table";
import { columns } from "./table-columns/sales";

const TicketsSoldForEvent: React.FC<HtmlHTMLAttributes<HTMLDivElement> & 
    { event: SingleEvent & {ticketsSold: Ticket[] | []} }> = ({children, className, event}) => {
    const [fallback, setFallback] = useState('Fetching tickets, please wait. This may take a moment...');
    const [tickets, error, isLoading] = useGetTicketSales(User as AppUser, event);

    useEffect(() => {
        if ( !isLoading && tickets.length == 0 ) {
            setFallback('No tickets sold yet...');
        }
    }, [isLoading]);

    return (
        <DataTable 
            columns={ columns } 
            data={ tickets } 
            fallback={ fallback }
            isFilteringEnabled={ true } 
            filterFields={ ['name','email','phone','ticketCategory','eventRef'] }>
            <colgroup>
                {
                    columns.map((column, index) => <col key={index} />)
                }
            </colgroup>
        </DataTable>
    )
}

export default TicketsSoldForEvent;