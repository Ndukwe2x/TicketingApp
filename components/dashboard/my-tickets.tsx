"use client";

import React from "react";
import { Providers } from "@/app/providers";
import { Api, HttpRequest } from "@/lib/api"
import { fetchDashboardData } from "@/hooks/FetchDashboardData";
import axios, { AxiosError } from "axios";
import { User } from "@/lib/logged-user";
import { usePathname, useRouter, useParams, useSearchParams, ReadonlyURLSearchParams } from "next/navigation";

export default function MyTickets() {
    const user = User;
    const [apiResponse, setApiResponse] = React.useState(null);
    const [tickets, setTickets] = React.useState([]);

    React.useEffect(() => {
        const url = user.user.userStatus === 'owner'
            ? Api.server + Api.endpoints.admin.tickets
            : Api.server + Api.endpoints.public.tickets;

        try {
            const response = axios.get(url, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            response.then((result) => {
                setApiResponse(result.data);
                if (result.data.data.tickets) {
                    setTickets(result.data.data.tickets);
                }
            });
        } catch (AxiosError) {
            console.error(AxiosError)
        }
    }, []);
    
    return (
        <ul className={layout}>
            {
                events.map((event, index) => <li key={index}><DynamicEventsList event={event} layout={layout} /></li>)
            }
        </ul>
    )
} 

const ErrorHandler = (error: AxiosError) => {
    console.log(error);
}