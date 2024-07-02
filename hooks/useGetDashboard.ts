
import { Api, HttpRequest } from "../lib/api";
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import useAuthenticatedUser from './useAuthenticatedUser';


export const getDashboardEvents = async (): Promise<DashboardEvent[]> => {

    const url = Api.server + Api.endpoints.admin.events;
    const events = (await HttpRequest(url)).json();

    return events;
};



export const getDashboardSales = async (): Promise<Ticket[]> => {

    const user = useAuthenticatedUser();
    const url = user?.isOwner
        ? Api.server + Api.endpoints.admin.tickets
        : Api.server + Api.endpoints.public.tickets;

    let result = [];
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${user?.token}`
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
