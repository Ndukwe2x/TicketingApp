"use client";

import React, { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { DataTable, DataTableLoading } from "../ui/data-table";
import { fetchUserEvents, useGetEvents, useGetEventsByIds, useGetEventsByUser } from "@/hooks/useGetEvents";
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
    const { pageDataBag, setPageData } = useAppData();
    const [events, setEvents] = useState<MultipleEvents>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [fallback, setFallback] = useState(
        <div className="text-center">Fetching events, please wait...</div>
    );

    useEffect(() => {
        if (owner === null || actor === null) {
            return;
        }

        setIsLoading(true);

        (async () => {
            setError(null);

            try {
                const fetchedEvents = await fetchUserEvents(owner.id, actor, true);
                if (fetchedEvents instanceof Array) {
                    const orderedByDate: Record<string, string>[] = orderByDate(fetchedEvents);
                    setEvents((orderedByDate as unknown) as MultipleEvents);
                }
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        })();

        return function cleanup() {

        }
    }, [owner, actor]);

    const defaultGridColumnRule = {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 3,
        xxl: undefined,
        ...(gridColumnRule && gridColumnRule)
    }

    useEffect(() => {
        setIsLoading(true);
        if (pageDataBag.page_activity) {
            const activity = pageDataBag.page_activity;
            if (activity.newEvent) {
                console.log(activity.newEvent);
                setEvents([activity.newEvent, ...events])
            } else if (activity.deletedEvent) {
                setEvents(events.filter(event => event._id !== activity.deletedEvent));
            }
            setIsLoading(false);
        }
    }, [pageDataBag.page_activity, events]);

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