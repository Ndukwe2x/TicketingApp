import { Api } from "@/lib/api";
import axios, { AxiosError, AxiosResponse } from "axios"
import { useEffect, useState } from "react";
import { useGetEventsByIds, useGetEventById, useGetEventsByUser } from "./useGetEvents";
import UserClass from "@/lib/User.class";
import { orderByDate } from "@/lib/utils";
import { APPCONFIG } from "@/lib/app-config";

const useGetUsers = (actor: AppUser): [isLoading: boolean, users: AppUser[] | [], error: AxiosError | null] => {
    
    const url = Api.server + Api.endpoints.admin.search
    const [users, setUsers] = useState<AppUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | null>(null);
    
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${actor.token}`
                    }
                });
                const result = response.data.data || {};
                const data = result.accounts || [];

                if ( data.length ) {
                    const orderedUsers = orderByDate(data, 'createdAt');
                    const decoratedUsers = orderedUsers.map((user: any) => new UserClass(user));
                    
                    setUsers(decoratedUsers);
                }
            } catch (error) {
                setError(error as any);
            } finally {
                setIsLoading(false);
            }
        }

        actor !== null && fetchUsers();
    }, [actor]);

    return [isLoading, users, error];
}


const useGetUserById = (userId: string, actor: AppUser, raw: boolean = false): 
    [isLoading: boolean, user: AppUser | UserInfo | null, error: Error | AxiosError | null] => {
    const [user, setUser] = useState<AppUser | UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', userId);

    const fetchUser = async (userId: string, actor: AppUser) => {
        setIsLoading(true);
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${actor.token}`
                }
            });
            const rawData = res.data.data || {};
            const processedData = rawData.id ? new UserClass(rawData) : null;
    
            if ( raw ) {
                setUser(rawData);
            } else {
                setUser(processedData as any);
            }
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        actor !== null && fetchUser(userId, actor);
        
    }, [actor]);
    
    return [isLoading, user, error];
}


const useGetUsersByEvent = (eventId: string, actor: AppUser): 
    [isLoading: boolean, users: AppUser[] | null, error: AxiosError | Error | null] => {
    const [users, setUsers] = useState<AppUser[] | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | Error | null>(null);
    
    useEffect(() => {
        if (actor == null) {
            return;
        }
        if ( eventId == '*' ) {
            setError(new Error('Invalid event id'));
            return;
        }
        const url = Api.server + Api.endpoints.admin.search + '?eventRef=' + eventId;
        setIsLoading(true);

        axios.get(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        })
        .then(res => {
            const data = res.data.data || {};
            if ( data.users ) {
                const appUsers = data.users.map((user: unknown) => new UserClass(user as UserInfo));
                setUsers(appUsers);
                setIsLoading(false);
            }
        })
        .catch(err => {
            setError(err);
            setIsLoading(false);
        });
    }, [eventId, actor]);

    return [isLoading, users, error];
}

const getAuthenticatedUserFullData = async (email: string, token: string): Promise<AppUser | null> => {
    
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

const useGetUserProperties = (userId: string, actor: AuthInfo): 
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

            const fetchedEvents = await useGetEventsByIds(data.eventRef, actor as any);
            setEvents(fetchedEvents as any);
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

const useGetUserTeams = (user: AppUser | null, actor: AppUser | null, ignoreError: boolean = false) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [teams, setTeams] = useState<{}>({});
    const [error, setError] = useState<Error | AxiosError | null | unknown>(null);
    
    const fetchTeams = async (eventIds: string[]) => {
        setIsLoading(true);

        const sendRequest = async (eventId: string) => {
            const url = Api.server + Api.endpoints.admin.search + '?eventRef=' + eventId;
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${actor?.token}`
                }
            });
            const data = res.data.data || {};
            return {[eventId]: data.accounts || []};
        }

        try {
            const batchResponse = await Promise.all(eventIds.map(sendRequest));
            
            batchResponse.forEach((data) => {
                for (const [key, value] of Object.entries(data)) {
                    setTeams(state => ({...state, [key]: value}));
                }
            })
        } catch (err) {
            setError(err);
            if ( !ignoreError ) {
                console.error(error)
            }
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if ( [user, actor].includes(null) ) {
            return;
        }
        const eventRefs = user.eventRef;
        if ( !eventRefs.length || eventRefs.includes('*')) {
            return;
        }
        fetchTeams(eventRefs);
    }, [user, actor]);

    return [isLoading, teams, error];
}

const useGetTeamMembers = (user: AppUser | null, actor: AppUser | null) => {
    const [teamMembers, setTeamMembers] = useState<unknown[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const [teamsLoading, teams, teamsError] = useGetUserTeams(user, actor);

    useEffect(() => {
        setIsLoading(teamsLoading as boolean);

        if ( !teamsLoading ) {
            if ( teamsError != null ) {
                setError(teamsError as any);
            } else {
                for (const [key, value] of Object.entries(teams as any)) {
                    setTeamMembers((state) => ([...state, ...value as any]));
                }
            }
            setIsLoading(false)
        }
    }, [teams]);

    return [isLoading, teamMembers, error];
}

// const useGetEventTeam = (eventId: string, actor: AppUser) {
//     const [team, setTeam] = useState<AppUser[] | UserInfo[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [error, setError] = useState<Error | AxiosError | null>(null);

//     useEffect(() => {
//         (async () => {
//             const url = Api.server + Api.endpoints.admin.search + '?eventRef=' + eventId;
//             const res = await axios.get(url, {
//                 headers: {
//                     Authorization: `Bearer ${actor?.token}`
//                 }
//             });
//             const data = res.data.data || {};
//             return {[eventId]: data.accounts || []};
//         })();
//     }, [])
// }

export {
    useGetUsers,
    useGetUserById,
    useGetUsersByEvent,
    getAuthenticatedUserFullData,
    useGetUserProperties,
    useGetUserTeams,
    useGetTeamMembers
}