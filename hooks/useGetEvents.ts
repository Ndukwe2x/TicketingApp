"use client";

import UserClass from '@/lib/User.class';
import { Api } from '@/lib/api';
import { User } from '@/lib/logged-user';
import { orderByDate } from '@/lib/utils';
// import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';


async function fetchEventById (eventId: string, surpressError: boolean = false) {
    let url = Api.server + Api.endpoints.public.singleEvent.replace(':id', eventId);

    try {
        const res = await axios.get(url);

        return res.data.data || null;
    } catch (err) {
        if ( !surpressError ) {
            throw err;
        }
        console.error(err);
    } finally {
        return null;
    }
}

// const fetchEventsByIds = async (eventIds: string[], actor: AppUser ) => {
//     return await Promise.all(eventIds.map(id => fetchEventById(id, actor)));
// }

const fetchEventsWithoutAuthorisation = async () => {
    const url = Api.server + Api.endpoints.public.events;
    const response = await axios.get(url);
    const data = response.data.data || {};
    
    return data.events || [];
}


/**
 * Fetch a single event by the given id
 * 
 * @param refid `string` Id of the event to fetch.
 * @param actor `AuthInfo` The current user of the application.
 * @param surpressError `boolean` Whether or not to throw exceptions if error occurs
 * @returns `SingleEvent | null`
 */
export const useGetEventById = ( refid: string, actor: AppUser, surpressError?: boolean ): [SingleEvent | null, AxiosError | null, boolean] => {
    let url = Api.server + Api.endpoints.public.singleEvent;
        url = url.replace( ':id', refid );
        surpressError = surpressError || false;
    const [event, setEvent] = useState<SingleEvent | null>(null);
    const [error, setError] = useState<AxiosError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get( url, {
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
    }, []);

    return [event, error, isLoading];
};

export const useGetEvents = (actor: AppUser): [isLoading: boolean, events: SingleEvent[] | [], error: AxiosError | null] => {
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
        if ( actor != null ) {
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
export const useGetEventsWithoutAuthorization = (): [isLoading: boolean, events: SingleEvent[] | [], error: AxiosError | null] => {
    const url = Api.server + Api.endpoints.public.events;
    const [events, setEvents] = useState<SingleEvent[] | []>([]);
    const [error, setError] = useState<AxiosError | null>(null);
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
export const useGetEventsByUser = ( theUser: AppUser, actor: AppUser): [ isLoading: boolean, events: SingleEvent[] | [], error: Error | AxiosError | null] => {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState<SingleEvent[]>([]);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    
    useEffect(() => {
        if ( [theUser, actor].includes(null) ) {
            return;
        }

        (async (IDs: string[]) => {
            setIsLoading(true);
            
            try {
                if ( IDs && IDs.length) {
                    const fetchedEvents = IDs.includes('*') 
                    ? await fetchEventsWithoutAuthorisation()
                    : await Promise.all(
                        IDs.map(id => fetchEventById(id))
                    );
    
                    setEvents(fetchedEvents);
                }
            } catch (error) {
                setError(error);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })(theUser.eventRef);

    }, [theUser]);


    return [isLoading, events, error];
}

/**
 * Fetch all events with id matching an id in the eventIds list.
 * 
 * @param eventIds string[] A list of IDs of the events to fetch
 * @param actor AuthInfo The current user of the application
 * @returns An array of SingleEvent object
 */
export const useGetEventsByIds = (eventIds: string[], actor: AppUser): [isLoading: boolean, events: SingleEvent[] | [], error: AxiosError | null] => {
    const [events, setEvents] = useState<SingleEvent[] | []>([]);
    const [error, setError] = useState<AxiosError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    
    useEffect(() => {
        (async (IDs: string[]) => {
            setIsLoading(true);
            try {
                if ( IDs && IDs.length && actor != null) {
                    const fetchedEvents = await Promise.all(
                        IDs.map(id => fetchEventById(id, true))
                    );
                    setEvents(fetchedEvents);
                }
            } catch (error) {
                setError(error);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })(eventIds);
    }, [eventIds]);

    return [isLoading, events, error];
}

export const decorateEvent = async (event: SingleEvent & { ticketsSold: Ticket[]}) => {
    const [isLoading, ticketsSold] = useGetTicketSales(User, event);
    event.ticketsSold = ticketsSold;
    
    return event;
}

export const useGetTicketSales = (actor: AppUser, event?: SingleEvent, ignoreError: boolean = false): 
[isLoading: boolean, tickets: Ticket[] | [], error: AxiosError | null] => {
    let url = [Api.server, Api.endpoints.admin.searchTickets].join('');

    const [tickets, setTickets] = useState<Ticket[] | []>([]);
    const [error, setError] = useState<AxiosError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const decorateTickets = async (tickets: Ticket[] | []) => {
        const decoratedTickets = await Promise.all(
            tickets.map((ticket) => getEventAssociatedToTicket(ticket, actor))
        );
        return decoratedTickets.filter((ticket) => ticket.event_title != null);
    };
    
    const fetchTickets = async (url: string): Promise<Ticket[] | []> => {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        });
        const data = res.data.data || {};
        const decoratedTickets = await decorateTickets(data.tickets || []);
        const orderedByDate = orderByDate(decoratedTickets, 'dateOfPurchase', 'asc');

        return orderedByDate;
    }

    useEffect(() => {
        if ( actor !== null ) {
            setIsLoading(true);
            (async () => {
                try {
                    let eventIds: string[] = [];
    
                    if ( event ) {
                        eventIds.push(event._id);
                    } else if ( actor.isUser && actor.eventRef.length > 0 ) {
                        eventIds = [...eventIds, ...actor.eventRef];
                    }
                    if ( eventIds.length > 0 ) {
                        const userTickets: any[] | [] = await Promise.all(
                            eventIds.map(async id => {
                                const eventUrl = url +  '?eventRef=' + id;
                                return await fetchTickets(eventUrl);
                            }
                        ));
                        setTickets(userTickets);
                    } else if ( actor.isOwner && actor.eventRef.includes('*') ) {
                        const allTickets = await fetchTickets(url);
                        setTickets(allTickets);
                    }
                } catch (error) {
                    setError(error);
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            })();
        }
        
    }, [actor]);
    
    return [isLoading, tickets, error];
}

export const useGetEventTicketsWithAssociatedEvent = (actor: AppUser, event?: SingleEvent, ignoreError: boolean = false) => {
    const url = Api.server + Api.endpoints.admin.searchTickets + (event ? '?eventRef=' + event._id : '');
    const [tickets, setTickets] = useState<Ticket[] | []>([]);
    const [error, setError] = useState<AxiosError | null>(null);
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
                setError(err as AxiosError);
                console.error(err);
            }
        }

        actor !== null && fetchTickets();
    }, [event])
    
    return [tickets, error];
}

export const getEventAssociatedToTicket = async ( ticket: Ticket): Promise<Ticket & {event_title?: string}> => {
    let url = Api.server + Api.endpoints.public.singleEvent;
        url = url.replace( ':id', ticket.eventRef );
    let event: SingleEvent | null = null, error = null;

    try {
        const res = await axios.get(url);
        event = res.data.data || null;
    } catch (err) {
        error = err;
        console.error(err);
    }
    
    return {...ticket, event_title: event?.title};
};