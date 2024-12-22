import { Api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { fetchEventTickets } from './useGetEvents';

export const useGetEventById = (id: string, user: AuthInfo) => {
    const eventQuery = useQuery({ queryKey: ['events', id], queryFn: () => getEventById(id, user) });

    const { data, ...rest } = eventQuery;

    return {
        ...rest,
        event: data,
    };
};

export const getEventById = async (id: string, user: AuthInfo) => {

    const url = Api.server + Api.endpoints.admin.event;

    url.replace(':id', id);
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    })
    return response.data;
};

export const deleteEvent = async (eventId: string, actor: AppUser) => {
    try {
        const url = Api.server + Api.endpoints.admin.event.replace(':id', eventId);
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        });

        return response.data.status === 'success';
    } catch (err) {
        console.error(err);
        return false;
    }
}

export const deleteEventTickets = async (eventId: string, actor: AppUser) => {
    const deleteTicket = async (ticket: Ticket) => {
        const url = Api.server + Api.endpoints.admin.singleTicket.replace(':id', ticket._id.toString());
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        }
        const response = await axios.delete(url, config);
        return response.status === 200;
    }
    try {
        const tickets: Ticket[] | [] = await fetchEventTickets(eventId, actor);
        if (!tickets.length) {
            return true;
        }
        await Promise.all(
            tickets.map(deleteTicket)
        );

        return true;
    } catch (error) {
        return false;
    }
}

