"use client";

import UserClass from '@/lib/User.class';
import { Api } from '@/lib/api';
import { User } from '@/lib/logged-user';
// import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

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

export const useGetEvents = (actor: AppUser) => {
    const url = Api.server + Api.endpoints.public.events;
    const [events, setEvents] = useState<SingleEvent[]>([]);
    const [error, setError] = useState<AxiosError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    useEffect(() => {
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        })
        .then(res => {
            let data = res.data.data ? res.data.data.events : [];
            setEvents(data);
            setIsLoading(false);
        })
        .catch(err => {
            setError(err);
            setIsLoading(false);
            console.error(err);
        });
    }, [actor]);
    
    return [events, error, isLoading];
};

/**
 * Fetches all events without requiring authorization. This is particularly applicable
 * to site owners who's eventRef array contains the asterisk `(*)` character, which 
 * gives one absolute authority over every event published on the application.
 * 
 * @returns `Promise<SingleEvent[] | null>`
 */
export const useGetEventsWithoutAuthorization = (): [SingleEvent[] | [], AxiosError | null, boolean] => {
    const url = Api.server + Api.endpoints.public.events;
    const [events, setEvents] = useState<SingleEvent[] | []>([]);
    const [error, setError] = useState<AxiosError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    React.useEffect(() => {
        axios.get(url)
        .then(res => {
            const data = res.data.data;
            console.log(data);
            const fetchedEvents = data || [];
            setEvents(fetchedEvents);
            setIsLoading(false);
        })
        .catch(err => {
            setError(err);
            setIsLoading(false);
            console.error(err);
        });
    }, []);
    
    return [events, error, isLoading];
};

/**
 * Fetch all events belonging to a particular user
 * 
 * @param theUser `AppUser` The user who's events are to be fetched
 * @param actor `AppUser` The current user of the application
 * @returns Returns a Promise that resolves into an array of `SingleEvent` on success and an empty array `[]` otherwise 
 */
export const useGetEventsByUser = ( theUser: AppUser, actor: AppUser): [SingleEvent[] | []] => {
    const [userEvents, error, isLoading]: [SingleEvent[] | [], AxiosError | null, boolean] = 
        theUser.eventRef.pop() == '*' 
        ? useGetEventsWithoutAuthorization()
        : getEventsByIds(theUser.eventRef, actor);

    return [userEvents];
}

/**
 * Fetch all events with id matching an id in the eventIds list.
 * 
 * @param eventIds string[] A list of IDs of the events to fetch
 * @param actor AuthInfo The current user of the application
 * @returns An array of SingleEvent object
 */
export const getEventsByIds = (eventIds: string[], actor: AppUser): [SingleEvent[] | [], AxiosError | null, boolean] => {
    const [events, setEvents] = useState<SingleEvent[] | []>([]);
    const [error, setError] = useState<AxiosError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    let url = Api.server + Api.endpoints.public.singleEvent;
    
    useEffect(() => {
        async function fetchEvent (eventId: string) {
            url = url.replace(':id', eventId);
            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${actor.token}`
                    }
                });
                if ( res.status == 200 && res.data.data ) {
                    return res.data.data;
                }
            } catch (err) {
                
            }
            return null;
        }

        const fetchEvents = async () => {
            const fetchedEvents = await Promise.all(eventIds.map((id) => fetchEvent(id)));
            setEvents(fetchedEvents);
            setIsLoading(false);
        }

        fetchEvents();
    }, []);

    return [events, error, isLoading];
}

export const decorateEvent = async (event: SingleEvent & { ticketsSold: Ticket[]}) => {
    let ticketsSold = await getEventTickets(User, event);
    event.ticketsSold = ticketsSold;
    
    return event;
}

export const useGetEventTickets = (user: AppUser, event?: SingleEvent, ignoreError: boolean = false): [Ticket[] | [], AxiosError | null, boolean] => {
    const url = Api.server + Api.endpoints.admin.searchTickets + (event ? '?eventRef=' + event._id : '');
    const [tickets, setTickets] = useState<Ticket[] | []>([]);
    const [error, setError] = useState<AxiosError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const decorateTickets = async (tickets: Ticket[] | []) => {
            const decoratedTickets = await Promise.all(
                tickets.map((ticket) => getEventAssociatedToTicket(ticket, user))
            );
            const filteredTickets = decoratedTickets
            .filter(ticket => ticket.event_title != null);
            // .map(ticket => ({...ticket, event_title: ticket.event.title}));
            
            return filteredTickets;
        }
        const fetchTickets = async () => {
            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                if (res.status === 200 && res.data.data) {
                    const data = res.data.data;
                    const decoratedTickets = await decorateTickets(data.tickets);
                    // if (res.data) {
                        setTickets(decoratedTickets);
                    // }
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err as AxiosError);
                setIsLoading(false);
                console.error(err);
            }
        }
        
        fetchTickets();
    }, [event]);
    
    return [tickets, error, isLoading];
}

export const useGetEventTicketsWithAssociatedEvent = (user: AppUser, event?: SingleEvent, ignoreError: boolean = false) => {
    const url = Api.server + Api.endpoints.admin.searchTickets + (event ? '?eventRef=' + event._id : '');
    const [tickets, setTickets] = useState<Ticket[] | []>([]);
    const [error, setError] = useState<AxiosError | null>(null);
    const [initialTickets, setInitialTickets] = useState();

    useEffect(() => {
        const fetchTickets = async () => {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            if (res.status === 200 && res.data.data) {
                const data = res.data.data;
                
                if (res.data) {
                    setTickets(data.tickets);
                }
            }
        }
        try {
            fetchTickets();
        } catch (err) {
            setError(err as AxiosError);
            console.error(err);
        }
    }, [event])
    
    return [tickets, error];
}

export const getEventAssociatedToTicket = async ( ticket: Ticket, actor: AppUser ): Promise<Ticket & {event_title?: string}> => {
    let url = Api.server + Api.endpoints.public.singleEvent;
        url = url.replace( ':id', ticket.eventRef );
    let event: SingleEvent | null = null, error = null;

    try {
        const res = await axios.get( url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        });
        if ( res.status == 200 && res.data.data ) {
            event = res.data.data;
        }
    } catch (err) {
        error = err;
        console.error(err);
    }
    
    return {...ticket, event_title: event?.title};
};