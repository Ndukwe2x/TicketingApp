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
    // const cachedEventsRef = useRef<MultipleEvents>([]);
    const [events, setEvents] = useState<MultipleEvents>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    // const [fetchingEvents, events, eventsFetchError] = useGetEventsByUser(
    //     owner as AppUser,
    //     actor as AppUser,
    //     true,
    //     [pageDataBag.page_activity],
    //     onOrderedEvents => orderByDate(onOrderedEvents as any)
    // );

    // const [isLoading, setIsLoading] = useState(fetchingEvents);
    // const [events, setEvents] = useState<MultipleEvents>([]);
    // const [error, setError] = useState<any>(null);
    const [fallback, setFallback] = useState(
        <div className="text-center">Fetching events, please wait...</div>
    );

    // useEffect(() => {
    //     cachedEventsRef.current = pageDataBag.my_events.items ?? [];
    //     setPageData('my_events', { items: events, totalEvents: events.length })
    // }, [events, setPageData]);

    useEffect(() => {
        if (owner === null || actor === null) {
            // setIsLoading(false);
            return;
        }
        // if (pageDataBag.page_activity) {
        //     const { newEvent, deletedEvent } = pageDataBag.page_activity as { newEvent: SingleEvent; deletedEvent: string }
        //     if (!(newEvent || deletedEvent)) {
        //         return;
        //     }
        // }
        setIsLoading(true);

        (async () => {
            // setIsLoading(true);
            // setEvents([]);
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


    // useEffect(() => {
    //     setEvents(eventsFetched);
    // }, [eventsFetched]);

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

    // React.useEffect(() => {
    //     if (isLoading) {
    //         return;
    //     }
    //     if (error) {
    //         setFallback(<RenderPrettyError error={error} />);
    //         return;
    //     }
    //     if (rawEvents.length < 1) {
    //         setFallback(<div className="text-center">No event to show.</div>);
    //         return;
    //     }

    //     const orderedByDate: Record<string, string>[] = orderByDate((rawEvents as unknown) as any);
    //     setEvents((orderedByDate as unknown) as MultipleEvents);

    //     return function cleanup() {
    //         // Clean up every possible side-effects
    //     }
    // }, [isLoading, error, rawEvents]);

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