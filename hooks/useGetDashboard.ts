import { dummySummary } from '@/lib/data';
import { Api, HttpRequest } from "../lib/api";
import { useQuery } from '@tanstack/react-query';


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

export const getDashboardUsers = async (): Promise<DashboardAttendees[]> => {
    // await new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve(true);
    //     }, 3000);
    // });

    // return dummyDashboardAttendees;

    const url = Api.server + Api.endpoints.admin.search;
    const users = (await HttpRequest(url)).json();
    
    return users;
};

export const getDashboardSales = async (): Promise<DashboardSales[]> => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 3000);
    });

    return [];
};

export const getDashboardTickets = async (): Promise<Tickets> => {
    const url = Api.server + Api.endpoints.admin.tickets;
    const tickets = (await HttpRequest(url)).json();
    
    return tickets;
}