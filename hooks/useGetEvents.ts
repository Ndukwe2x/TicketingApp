"use client";

import { Api } from '@/lib/api';
import { User } from '@/lib/logged-user';
// import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const getEventById = async ( refid: string, user: AuthInfo, surpressError?: boolean ) => {
    let url = Api.server + Api.endpoints.public.singleEvent;
        url = url.replace( ':id', refid );
        surpressError = surpressError || false;

    try {
        const response = await axios.get( url, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        } );

        if ( response.status === 200 && response.data ) {
            return response.data.data;
        }
    } catch ( error ) {
        if ( !surpressError ) {
            throw error;
        }
        return null;
    }
    return null;
};

export const getEvents = async (user: AuthInfo) => {
    const url = Api.server + Api.endpoints.admin.events;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    });
    if (response.status === 200) {
        return response.data;
    }
    return null;
};


export const decorateEvent = async (event: SingleEvent & { ticketsSold: Ticket[]}) => {
    let ticketsSold = await getEventTickets(User, event);
    event.ticketsSold = ticketsSold;
    
    return event;
}

export const getEventTickets = async (user: AuthInfo, event?: SingleEvent) => {
    const url = Api.server + Api.endpoints.admin.searchTickets + (event ? '?eventRef=' + event._id : '');

    let result = [];
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    });
    if (response.status === 200) {
        if (response.data) {
            result = response.data.data.tickets;
        }
    }
    return result;
}

export const getEventAssociatedToTicket = async ( ticket: Ticket, user: AuthInfo ) => {
    const event = await getEventById( ticket.eventRef, user, true );
    
    return {...ticket, event: event};
};