"use client";

import React, { HtmlHTMLAttributes, useEffect, useState } from "react";
import { DataTable, DataTableLoading } from "../ui/data-table";
import { useGetEvents, useGetEventsByIds, useGetEventsByUser } from "@/hooks/useGetEvents";
import { columns } from "./table-columns/events";
import { DataGrid } from "../ui/data-grid";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import EventGridTemplate from "./grid-data-templates/event";
import { orderByDate } from "@/lib/utils";
import { APPCONFIG } from "@/lib/app-config";
import RenderPrettyError from "../render-pretty-error";
import { useAppData } from "@/hooks/useCustomContexts";

const MyEvents: React.FC<HtmlHTMLAttributes<HTMLDivElement> & {
    layout: string;
    isFilteringEnabled: boolean;
    filterParams: string[];
    gridColumnRule?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        xxl?: number;
    };
    owner?: AppUser | UserInfo | null;
}> = ({ layout, isFilteringEnabled = false, filterParams = [], gridColumnRule, owner, ...props }) => {
    const actor = useAuthenticatedUser();
    owner = owner ?? actor;
    const { maxItemsPerPage = 10 } = APPCONFIG.paginationOptions;

    const [isLoading, rawEvents, error] = useGetEventsByUser(owner as AppUser, actor as AppUser, true);
    const [events, setEvents] = useState<SingleEvent[] | []>([]);
    const [fallback, setFallback] = useState(<div className="text-center">Fetching events, please wait...</div>);
    const { pageDataBag } = useAppData();
    const defaultGridColumnRule = {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 3,
        xxl: undefined,
        ...(gridColumnRule && gridColumnRule)
    }

    React.useEffect(() => {
        if (isLoading) {
            return;
        }
        if (error) {
            setFallback(<RenderPrettyError error={error} />);
            return;
        }

        if (rawEvents.length < 1) {
            setFallback(<div className="text-center">No event to show.</div>);
            return;
        }

        const orderedByDate: Record<string, string>[] = orderByDate((rawEvents as unknown) as any);
        setEvents((orderedByDate as unknown) as SingleEvent[]);

        return function cleanup() {
            // Clean up every possible side-effects
        }
    }, [isLoading, error, rawEvents]);

    useEffect(() => {
        if (pageDataBag.page_activity) {
            const activity = pageDataBag.page_activity;
            if (activity.newEvent) {
                setEvents(events => ([activity.newEvent, ...events]))
            } else if (activity.deletedEvent) {
                setEvents(state => state.filter(event => event._id !== activity.deletedEvent));
            }
        }
    }, [pageDataBag.page_activity])

    return (
        (events.length > 0) ? (
            layout === 'list'
                ? (
                    <DataTable className="vertical-stripe" columns={columns} data={events}
                        fallback={<DataTableLoading />}
                        isFilteringEnabled={true}
                        filterFields={filterParams}>
                        <colgroup>
                            {
                                columns.map((column, index) => <col id={column.id} key={index} />)
                            }
                        </colgroup>
                    </DataTable>
                ) : (
                    <DataGrid Template={EventGridTemplate} data={events} columnRule={defaultGridColumnRule} paginationOptions={{ itemsPerPage: maxItemsPerPage }} fallback="Loading... Please wait" />
                )
        ) : (
            fallback
        )
    )
}


export default MyEvents;