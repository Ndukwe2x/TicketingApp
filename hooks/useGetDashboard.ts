import { dummySummary } from '@/lib/data';
import { Api, HttpRequest } from "../lib/api";
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { User } from '@/lib/logged-user';
import UserClass from '@/lib/User.class';
import { useEffect, useState } from 'react';
import { orderByDate } from '@/lib/utils';


// Dashboard Data Hooks

export const useGetDashboardSummary = () => {
    const eventQuery = useQuery({
        queryKey: ['dashboard', 'summary'],
        queryFn: getDashboardSummary,
    });

    const { data, ...rest } = eventQuery;

    return {
        ...rest,
        summary: data,
    };
};

export const getDashboardSummary = async () => {
    let events, tickets;
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 2000);
    });

    return dummySummary;
};

export const getDashboardEvents = async (): Promise<DashboardEvent[]> => {

    const url = Api.server + Api.endpoints.admin.events;
    const events = (await HttpRequest(url)).json();
    
    return events;
};



export const getDashboardSales = async (): Promise<Ticket[]> => {

    const user = User;
    const url = user?.isOwner
        ? Api.server + Api.endpoints.admin.tickets
        : Api.server + Api.endpoints.public.tickets;
    
    let result = [];
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
        if (response.data && response.data.data.tickets) {
            result = response.data.data.tickets;
        }
    } catch (error) {
        console.log(error)
    }

    return result;
};

// export const getDashboardTickets = async (): Promise<Tickets> => {
//     const url = Api.server + Api.endpoints.admin.tickets;
//     const tickets = (await HttpRequest(url)).json();
    
//     return tickets;
// }