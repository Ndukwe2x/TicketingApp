"use client";

import UserClass from '@/lib/User.class';
import { Api } from '@/lib/api';
import { orderByDate } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import useAuthenticatedUser from './useAuthenticatedUser';
import { fetchUserById } from './useGetUsers';


export async function fetchEventById(eventId: string, surpressError: boolean = false) {
    let url = Api.server + Api.endpoints.public.singleEvent.replace(':id', eventId);

    try {
        const res = await axios.get(url);
        return res.data.data || null;
    } catch (error) {
        if (surpressError) {
            console.error(error);
            return false;
        }
        throw error;
    }
}

// const fetchEventsByIds = async (eventIds: string[], actor: AppUser ) => {
//     return await Promise.all(eventIds.map(id => fetchEventById(id, actor)));
// }

export const fetchEventsWithoutAuthorisation = async () => {
    const url = Api.server + Api.endpoints.public.events;
    const response = await axios.get(url);
    const data = response.data.data || {};

    return data.events || [];
}

/**
 * 
 * @param userId string
 * @param actor AppUser
 * @returns Promise<SingleEvent[] | [] | unknown>
 * @throws Error | AxiosError
 */
export const fetchUserEvents = async (userId: string, actor: AppUser): Promise<SingleEvent[] | [] | unknown> => {
    if (!userId || !actor) {
        throw new Error('No user or actor provided');
    }

    try {
        const user = await fetchUserById(userId, actor);
        if (user === null) {
            throw new Error(`Unknown user! No user found for id: (${userId})`);
        }
        const eventIds = user.eventRef;
        const fetchedEvents = eventIds.includes('*')
            ? await fetchEventsWithoutAuthorisation()
            : await Promise.all(
                eventIds.map(id => fetchEventById(id))
            );

        return fetchedEvents;
    } catch (error) {
        return error;
    }
}


/**
 * Fetch a single event by the given id
 * 
 * @param refid `string` Id of the event to fetch.
 * @param actor `AuthInfo` The current user of the application.
 * @param surpressError `boolean` Whether or not to throw exceptions if error occurs
 * @returns `SingleEvent | null`
 */
export const useGetEventById = (refid: string, actor: AppUser, surpressError?: boolean):
    [isLoading: boolean, event: SingleEvent | null, error: any] => {
    let url = Api.server + Api.endpoints.public.singleEvent;
    url = url.replace(':id', refid);
    surpressError = surpressError || false;
    const [event, setEvent] = useState<SingleEvent | null>(null);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (actor == null) {
            return;
        }
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        })
            .then(res => {
                const data = res.data.data || null;
                setEvent(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err);
                setIsLoading(false);
                console.error(err);
            })
    }, [actor]);

    return [isLoading, event, error];
};

export const useGetEvents = (actor: AppUser): [isLoading: boolean, events: SingleEvent[] | [], error: any] => {
    const url = Api.server + Api.endpoints.admin.events;
    const [events, setEvents] = useState<SingleEvent[]>([]);
    const [error, setError] = useState<AxiosError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = () => {
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${actor.token}`
                }
            })
                .then(res => {
                    let data = res.data.data ? res.data.data.events : [];
                    setEvents(data);
                })
                .catch(err => {
                    setError(err);
                    // console.error(err);
                })
                .finally(() => setIsLoading(false));
        }
        if (actor != null) {
            fetchData();
        }
    }, [actor]);

    return [isLoading, events, error];
};

/**
 * Fetches all events without requiring authorization. This is particularly applicable
 * to site owners who's eventRef array contains the asterisk `(*)` character, which 
 * gives one absolute authority over every event published on the application.
 * 
 * @returns `Promise<SingleEvent[] | null>`
 */
export const useGetEventsWithoutAuthorization = (): [isLoading: boolean, events: SingleEvent[] | [], error: any] => {
    const url = Api.server + Api.endpoints.public.events;
    const [events, setEvents] = useState<SingleEvent[] | []>([]);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    React.useEffect(() => {
        axios.get(url)
            .then(res => {
                const data = res.data.data || {};
                const fetchedEvents = data.events || [];
                setEvents(fetchedEvents);
            })
            .catch(err => {
                setError(err);
                console.error(err);
            })
            .finally(() => setIsLoading(false))
    }, []);

    return [isLoading, events, error];
};

/**
 * Fetch all events belonging to a particular user
 * 
 * @param theUser `AppUser` The user who's events are to be fetched
 * @param actor `AppUser` The current user of the application
 * @returns Returns an array of `SingleEvent` on success and an empty array `[]` otherwise 
 */
export const useGetEventsByUser = (theUser: AppUser, actor: AppUser): [
    isLoading: boolean,
    events: SingleEvent[] | [],
    error: any
] => {
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<SingleEvent[]>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (theUser === null || actor === null) {
            setIsLoading(false);
            return;
        }

        (async () => {
            try {
                const fetchedEvents = await fetchUserEvents(theUser.id, actor);
                if (fetchedEvents instanceof Array) {
                    if ([...fetchedEvents].shift()?._id) {
                        setEvents(fetchedEvents);
                    }
                }
            } catch (err) {
                console.error(err);
                setError(err);
            }
        })();


        return function cleanup() {

        }
    }, [theUser, actor, setError, setEvents]);


    return [isLoading, events, error];
}

/**
 * Fetch all events with id matching an id in the eventIds list.
 * 
 * @param eventIds string[] A list of IDs of the events to fetch
 * @param actor AuthInfo The current user of the application
 * @returns An array of SingleEvent object
 */
export const useGetEventsByIds = (eventIds: string[], actor: AppUser): [
    isLoading: boolean,
    events: SingleEvent[] | [],
    error: any
] => {
    const [events, setEvents] = useState<SingleEvent[] | []>([]);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        (async (IDs: string[]) => {
            // if (!navigator.onLine) {
            //     setIsLoading(false);
            //     return;
            // }
            try {
                if (IDs && IDs.length && actor != null) {
                    const fetchedEvents = await Promise.all(
                        IDs.map(id => fetchEventById(id))
                    );
                    const filteredEvents = fetchedEvents.filter(event => typeof event._id !== 'undefined')

                    setEvents(filteredEvents);
                    setIsLoading(false);
                }
            } catch (error) {
                setError(error);
                console.error(error);
                setIsLoading(false);
            }
        })(eventIds);
    }, [eventIds]);

    return [isLoading, events, error];
}

export const decorateEvent = async (event: SingleEvent & { ticketsSold: Ticket[] }) => {
    const actor = useAuthenticatedUser();
    const [isLoading, ticketsSold] = useGetTicketSales(actor as AppUser, event);
    event.ticketsSold = ticketsSold;

    return event;
}

export const useGetTicketSales = (actor: AppUser, event?: SingleEvent, ignoreError: boolean = false):
    [
        isLoading: boolean,
        tickets: Ticket[] | [],
        error: any
    ] => {
    let url = [Api.server, Api.endpoints.admin.searchTickets].join('');

    const [tickets, setTickets] = useState<Ticket[] | []>([]);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const decorateTickets = async (tickets: Ticket[] | []) => {
        const decoratedTickets = await Promise.all(
            tickets.map((ticket) => getEventAssociatedToTicket(ticket))
        );
        return decoratedTickets.filter((ticket) => ticket.event_title != null);
    };

    const fetchUserTickets = async (url: string): Promise<Ticket[] | []> => {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        });
        const data = res.data.data || {};
        const decoratedTickets = await decorateTickets(data.tickets || []);
        const orderedByDate = (orderByDate(
            (decoratedTickets as unknown) as { key: string, value: string }[],
            'dateOfPurchase', 'asc'
        ) as unknown) as Tickets;

        return orderedByDate;
    }

    useEffect(() => {
        if (actor === null) {
            return;
        }
        // setIsLoading(true);

        const fetchTickets = async () => {
            let eventIds: string[] = [];
            if (event) {
                eventIds.push(event._id);
            } else if (actor.isUser && actor.eventRef.length > 0) {
                eventIds = [...eventIds, ...actor.eventRef];
            }

            try {
                let allTickets: any[] = [];
                if (eventIds.length > 0) {
                    const eventsTickets: Ticket[][] | [] = await Promise.all(
                        eventIds.map(async id => {
                            const eventUrl = url + '?eventRef=' + id;
                            return await fetchUserTickets(eventUrl);
                        }
                        ));

                    for (const eventTickets of eventsTickets) {
                        for (const eventTicket of eventTickets) {
                            allTickets.push(eventTicket);
                        }
                    }
                } else if (actor.isOwner && actor.eventRef.includes('*')) {
                    allTickets = await fetchUserTickets(url);
                }
                setTickets(allTickets);
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();

        return function cleanup() {
            // Clean up every effect, to avoid side-effects
        }
    }, [actor]);

    return [isLoading, tickets, error];
}

export const useGetEventTicketsWithAssociatedEvent = (actor: AppUser, event?: SingleEvent, ignoreError: boolean = false) => {
    const url = Api.server + Api.endpoints.admin.searchTickets + (event ? '?eventRef=' + event._id : '');
    const [tickets, setTickets] = useState<Ticket[] | []>([]);
    const [error, setError] = useState<AxiosError | null | unknown>(null);
    const [initialTickets, setInitialTickets] = useState();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${actor.token}`
                    }
                });
                if (res.status === 200 && res.data.data) {
                    const data = res.data.data;

                    if (res.data) {
                        setTickets(data.tickets);
                    }
                }
            } catch (error) {
                setError(error);
                console.error(error);
            }
        }

        actor !== null && fetchTickets();
    }, [event])

    return [tickets, error];
}

export const getEventAssociatedToTicket = async (ticket: Ticket): Promise<Ticket & { event_title?: string }> => {
    let url = Api.server + Api.endpoints.public.singleEvent;
    url = url.replace(':id', ticket.eventRef);
    let event: SingleEvent | null = null, error = null;

    try {
        const res = await axios.get(url);
        event = res.data.data || null;
    } catch (err) {
        error = err;
        console.error(err);
    }

    return { ...ticket, event_title: event?.title };
};