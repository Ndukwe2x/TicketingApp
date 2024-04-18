"use client";

import React from "react";
import { Providers } from "@/app/providers";
import { Api, HttpRequest } from "@/lib/api"
import { fetchDashboardData } from "@/hooks/FetchDashboardData";
import axios, { AxiosError } from "axios";
import { User } from "@/lib/logged-user";
import { usePathname, useRouter, useParams, useSearchParams, ReadonlyURLSearchParams } from "next/navigation";

export default function MyEvents({layout}: string) {
    const user = User();
    const [events, setEvents] = React.useState([]);

    React.useEffect(() => {
        const url = Api.server + Api.endpoints.admin.events + '?';
        
        const response = fetchDashboardData(url, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
        console.log(response);
        
        // setEvents(data);
    }, []);

    if ( !events.length ) return 'No events to show...';
    
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