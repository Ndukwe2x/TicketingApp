"use client";

import React, { HtmlHTMLAttributes, useEffect, useState } from "react";
import { Api } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { useGetTicketSales } from "@/hooks/useGetEvents";
import NoNetwork from "../no-network";
import { DataTable, DataTableLoading } from "../ui/data-table";
import { DataGrid } from "../ui/data-grid";
import { columns } from "./table-columns/sales";
import InternalErrorPage from "@/app/internal-error";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import TicketGridTemplate from "./grid-data-templates/ticket";
import { orderByDate } from "@/lib/utils";

const MyTickets: React.FC<HtmlHTMLAttributes<HTMLDivElement> & { layout: string; isFilteringEnabled: boolean; filterParams: string[] }> = ({ children, layout, isFilteringEnabled = false, filterParams = [], ...props }) => {
    const actor = useAuthenticatedUser();
    const dataGridColumns: [] = [];
    const [isLoading, userTickets, error] = useGetTicketSales(actor as AppUser);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [fallback, setFallback] = useState(<div className="text-center">Loading, please waith...</div>);

    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (error != null) {
            if (error?.code && ['ERR_NETWORK', 'ECONNABORTED'].includes(error.code)) {
                setFallback(<NoNetwork />)
            } else {
                setFallback(<InternalErrorPage />)
            }
            return;
        }

        if (userTickets.length < 1) {
            setFallback(<div className="text-center">No tickets to show</div>);
            return;
        }

        const ordered: Record<string, string>[] = orderByDate((userTickets as unknown) as any);
        setTickets((ordered as unknown) as Ticket[]);

        return function cleanup() {
            // Clean up every possible side-effects
        }
    }, [isLoading, error, userTickets]);


    return (
        (tickets.length > 0)
            ? (
                layout === 'list'
                    ? (
                        <DataTable
                            className="vertical-stripe"
                            columns={columns}
                            data={tickets}
                            fallback={<DataTableLoading />}
                            isFilteringEnabled={true}
                            filterFields={filterParams}>
                            <colgroup>
                                {
                                    columns.map((column, index) => <col key={index} />)
                                }
                            </colgroup>
                        </DataTable>
                    ) : (
                        <DataGrid Template={TicketGridTemplate} data={tickets} columnRule={{ sm: 2, md: 2, lg: 3, xl: 3 }} fallback="Loading..." />
                    )
            ) : (
                fallback
            )
    )
}

export default MyTickets;