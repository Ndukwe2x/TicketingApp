import React from "react";
import { Api, HttpRequest } from "../lib/api";

export const getPublicEvents = () => {
    const url = Api.server + Api.endpoints.admin.events;
    // const [result, setResult] = React.useState({});
    const [events, setEvents] = React.useState<SingleEvent[]>([]);

    async () => (await HttpRequest(url)).json().then((res) => {
        const data = res.data || {};
        if (data.events) {
            setEvents(data.events)
        }
    });

    const getEvent = (id: string) => {
        return events.find((event, index) => event._id === id);
    };

    const getFeaturedEvents = () => {
        return events.filter(event => event.featured);
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
