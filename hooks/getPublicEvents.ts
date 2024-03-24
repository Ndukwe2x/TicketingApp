import React from "react";
import { Api, HttpRequest } from "../lib/api";
import { dummyEvents } from '@/lib/data';

export const getPublicEvents = () => {
    const url = Api.server + Api.endpoints.admin.events;
    const [result, setResult] = React.useState({});
    const [events, setEvents] = React.useState(dummyEvents);
    
    async () => (await HttpRequest(url)).json().then((res) => {
        setResult(res);
        if (result.length && typeof result.data.events !== 'undefined') {
            setEvents(result.data.events)
        }
    });

    const getEvent = (id: string) => {
        return events.find((event: {id: string}) => event.id === id);
    };

    const getFeaturedEvents = () => {
        return events.filter((event: {featured: boolean}) => event.featured);
    };

    return {
        events: events,
        featuredEvents: getFeaturedEvents(),
        getEvent,
    };

    // const getEvent = (id: string) => {
    //     return events.find((event) => event.id === id);
    // };

    // const getFeaturedEvents = () => {
    //     return dummyEvents.filter((evt) => evt.featured);
    // };

    // return {
    //     events: dummyEvents,
    //     featuredEvents: getFeaturedEvents(),
    //     getEvent,
    // };
};
