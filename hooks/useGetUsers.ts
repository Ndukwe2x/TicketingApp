import { Api } from "@/lib/api";
import axios, { AxiosError, AxiosResponse } from "axios"
import { useEffect, useState } from "react";
import { getEventsByIds, useGetEventById, useGetEventsByUser } from "./useGetEvents";
import UserClass from "@/lib/User.class";

/** */
export const useGetUserById = (userId: string, actor: AppUser): 
    [user: AppUser | null, isLoading: boolean, error: typeof AxiosError | null] => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', userId);

    useEffect(() => {
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        })
        .then(res => {
            const userData = res.data.data;
            
            setUser(new UserClass(userData));
            setIsLoading(false);
        })
        .catch(err => {
            setError(err);
            setIsLoading(false);
        });
    }, [userId]);
    
    return [user, isLoading, error];
}

export const getAuthenticatedUserFullData = async (email: string, token: string): Promise<AppUser | null> => {
    
    const url = Api.server + Api.endpoints.admin.search + '?email=' + email;
    let result: { data: { accounts: [] } } | null = null;
    let user: AppUser | null = null;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        result = response.data;
        
        if ( result?.data && result?.data.accounts ) {
            user = result.data.accounts.shift() || null;
        }
    } catch (error) {
        console.log(error)
    }

    return user;
}

export const useGetUserProperties = (userId: string, actor: AuthInfo): 
    [user: AppUser | null, events: SingleEvent[], isLoading: boolean, error: typeof AxiosError | null] => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [events, setEvents] = useState<SingleEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const usersSrc = Api.server + Api.endpoints.admin.singleUser.replace(':id', userId);

    useEffect(() => {
        const fetchUserEvents = async (res: AxiosResponse) => {
            const data: AppUser = res.data.data;
            setUser(data);

            const fetchedEvents = await getEventsByIds(data.eventRef, actor);
            setEvents(fetchedEvents);
            setIsLoading(false);
        }

        axios.get(usersSrc, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        })
        .then(fetchUserEvents)
        .catch(err => {
            setError(err);
            setIsLoading(false);
        });
    }, [userId]);

    return [user, events, isLoading, error];
}
