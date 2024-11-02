"use client";

import UserClass from '@/lib/User.class';
import { Api } from '@/lib/api';
import { orderByDate } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import useAuthenticatedUser from './useAuthenticatedUser';
import { fetchUserById } from './useGetUsers';


/**
 * 
 * @param eventId {string} The id of the event to fetch
 * @param failQuietly {boolean} whether or not to surpress exceptionss in case of failure
 * @returns Promise<SingleEvent | null>
 */
export async function fetchEventById(eventId: string, failQuietly: boolean = false): Promise<SingleEvent | null> {
    let url = Api.server + Api.endpoints.public.singleEvent.replace(':id', eventId);

    try {
        const res = await axios.get(url);
        return res.data.data || null;
    } catch (error) {
        if (failQuietly) {
            console.error(error);
            return null;
        }
        throw error;
    }
}

// const fetchEventsByIds = async (eventIds: string[], actor: AppUser ) => {
//     return await Promise.all(eventIds.map(id => fetchEventById(id, actor)));
// }

export const fetchEventsWithoutAuthorisation = async (): Promise<MultipleEvents | []> => {
    const url = Api.server + Api.endpoints.public.events;
    const response = await axios.get(url);
    const data = response.data.data || {};

    return data.events || [];
}

/**
 * 
 * @param userId {string}
 * @param actor {AppUser}
 * @param ignoreFetchError {boolean} Whether to terminate the operation when an error occurs with any
 * of the events or to ignore errors from failed records and return only the records with 
 * no errors
 * @returns Promise<MultipleEvents | []>
 * @throws Error | AxiosError
 */
export const fetchUserEvents = async (
    userId: string,
    actor: AppUser,
    ignoreFetchError: boolean = false
): Promise<MultipleEvents | []> => {
    if (!userId || !actor) {
        throw new Error('No user or actor provided');
    }

    const user = await fetchUserById(userId, actor);
    if (user === null) {
        throw new Error(`Unknown user! No user found for id: (${userId})`);
    }
    const eventIds = user.eventRef;
    if (!eventIds.length) {
        return [];
    }

    const fetchedEvents: Array<SingleEvent | null> = eventIds.includes('*')
        ? await fetchEventsWithoutAuthorisation()
        : await Promise.all(
            eventIds.map(id => fetchEventById(id, ignoreFetchError))
        );


    return fetchedEvents.filter(event => event !== null) as MultipleEvents | [];
}

export const decorateEvent = async (event: SingleEvent & { ticketsSold: Tickets }) => {
    const actor = useAuthenticatedUser();
    const [isLoading, ticketsSold] = useGetTicketSales(actor as AppUser, event);
    event.ticketsSold = ticketsSold;

    return event;
}

export const decorateTickets = async (tickets: Tickets | []) => {
    const decoratedTickets: Tickets = await Promise.all(
        tickets.map((ticket) => getEventAssociatedToTicket(ticket))
    );
    return decoratedTickets.filter(ticket => ticket.eventTitle != null);
};

export const fetchEventTickets = async (eventId: string, actor: AppUser): Promise<Tickets | []> => {
    let url = [Api.server, Api.endpoints.admin.searchTickets, '?eventRef=', eventId].join('');

    const options = {
        headers: {
            Authorization: `Bearer ${actor.token}`
        }
    }
    // const preflightRes = await axios.options(url, options);
    // if (preflightRes.status !== 200) {
    //     return [];
    // }
    const res = await axios.get(url, options);
    // if (res.status !== 200) {
    //     return [];
    // }
    const data = res.data.data || {};
    let tickets: Tickets | [] = data.tickets || [];

    if (tickets.length) {
        // tickets = decorate ? await decorateTickets(tickets) : tickets;

        tickets = (orderByDate(
            (tickets as unknown) as { key: string, value: string }[],
            'dateOfPurchase', 'asc'
        ) as unknown) as Tickets;
    }

    return tickets;
}

/**
 * Fetches all tickets associated to a particular user
 * 
 * @param actor The user of the application
 * @returns Promise<Tickets | []>
 * @throws AxiosError
 */
export const fetchUserTickets = async (actor: AppUser): Promise<Tickets | []> => {
    let url = [Api.server, Api.endpoints.admin.tickets].join('');
    const options = {
        headers: {
            Authorization: `Bearer ${actor.token}`
        }
    }

    const res = await axios.get(url, options);
    const data = res.data.data || {};
    let tickets: Tickets | [] = data.tickets || [];

    if (tickets.length) {
        tickets = (orderByDate(
            (tickets as unknown) as { key: string, value: string }[],
            'dateOfPurchase', 'asc'
        ) as unknown) as Tickets;
    }

    return tickets;
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

export const useGetEvents = (actor: AppUser): [isLoading: boolean, events: MultipleEvents | [], error: any] => {
    const url = Api.server + Api.endpoints.admin.events;
    const [events, setEvents] = useState<MultipleEvents>([]);
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
 * @returns `Promise<MultipleEvents | null>`
 */
export const useGetEventsWithoutAuthorization = (): [isLoading: boolean, events: MultipleEvents | [], error: any] => {
    const url = Api.server + Api.endpoints.public.events;
    const [events, setEvents] = useState<MultipleEvents | []>([]);
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
export const useGetEventsByUser = (theUser: AppUser, actor: AppUser, ignoreFetchError: boolean = false): [
    isLoading: boolean,
    events: MultipleEvents | [],
    error: any
] => {
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<MultipleEvents>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (theUser === null || actor === null) {
            // setIsLoading(false);
            return;
        }

        (async () => {
            try {
                const fetchedEvents = await fetchUserEvents(theUser.id, actor, ignoreFetchError);
                if (fetchedEvents instanceof Array) {
                    if ([...fetchedEvents].shift()?._id) {
                        setEvents(fetchedEvents);
                    }
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
    events: MultipleEvents | [],
    error: any
] => {
    const [events, setEvents] = useState<MultipleEvents | []>([]);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        (async (IDs: string[]) => {
            try {
                if (IDs && IDs.length && actor != null) {
                    const fetchedEvents: Array<SingleEvent | null> = await Promise.all(
                        IDs.map(id => fetchEventById(id, true))
                    );
                    if (!fetchedEvents.length) {
                        setIsLoading(false);
                        return;
                    }

                    const filteredEvents = fetchedEvents.filter(event => event !== null) as MultipleEvents;

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

export const useGetTicketSales = (targetUser: AppUser, event?: SingleEvent, ignoreError: boolean = false):
    [
        isLoading: boolean,
        tickets: Tickets | [],
        error: any
    ] => {

    const actor = useAuthenticatedUser();
    const [tickets, setTickets] = useState<Tickets | []>([]);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!actor || !targetUser) {
            return;
        }

        const fetchTickets = async () => {
            try {
                let eventIds: string[] = [];
                if (event) {
                    eventIds.push(event._id);
                } else {
                    const userEvents = await fetchUserEvents(targetUser.id, actor, true);
                    if (!userEvents.length) {
                        setIsLoading(false);
                        return;
                    }
                    // eventIds = [...eventIds, ...actor.eventRef];
                    eventIds = userEvents.map(event => event._id);
                }

                let allTickets: any[] = [];
                if (eventIds.length) {
                    const eventsTickets: Tickets[] | [] = await Promise.all(
                        eventIds.map(async eventId => {
                            return await fetchEventTickets(eventId, actor);
                        })
                    );

                    for (const eventTickets of eventsTickets) {
                        for (const eventTicket of eventTickets) {
                            allTickets.push(eventTicket);
                        }
                    }
                }
                // else if (actor.isOwner) {
                //     allTickets = await fetchUserTickets(actor);
                // }
                // const userTickets = await fetchUserTickets(actor);
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
    const [tickets, setTickets] = useState<Tickets | []>([]);
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
    }, [event, actor])

    return [tickets, error];
}

export const getEventAssociatedToTicket = async (ticket: Ticket): Promise<Ticket & { eventTitle?: string }> => {
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

    return { ...ticket, eventTitle: event?.title };
};