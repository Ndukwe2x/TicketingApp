import { Api } from "@/lib/api";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useGetEventsByIds, useGetEventById, useGetEventsByUser, fetchUserEvents } from "./useGetEvents";
import UserClass from "@/lib/User.class";
import { orderByDate } from "@/lib/utils";

const fetchUsersByEventId = async (eventId: string, actor: AppUser): Promise<UserInfo[] | []> => {
    const url = Api.server + Api.endpoints.admin.search + '?eventRef=' + eventId;
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${actor?.token}`
        }
    });
    const data = res.data.data || {};
    return data.accounts || [];
}

/**
 * Disconnects a user from an event to which they are a team member
 * 
 * @param user { UserInfo } The user to dissociate from the event
 * @param eventId {string} The id of the event 
 * @param actor {AppUser} The current logged in user
 * @returns Promise<boolean> True if the response is ok and false otherwise
 * @throws AxiosError
 */
const dissociateUserFromEvent = async (user: UserInfo, eventId: string, actor: AppUser): Promise<boolean> => {
    const modifiedUser = { ...user, eventRef: [...user.eventRef].filter(ref => ref !== eventId) }
    const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', user.id);
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${actor.token}`
        }
    }
    const response = await axios.patch(url, modifiedUser, config);

    return response.status === 200;
}

const useGetUsers = (actor: AppUser): [isLoading: boolean, users: AppUser[] | [], error: any] => {

    const url = Api.server + Api.endpoints.admin.search;
    const [users, setUsers] = useState<AppUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

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

                if (data.length) {
                    const orderedUsers = orderByDate(data, 'createdAt');
                    const decoratedUsers = orderedUsers.map((user: any) => (new UserClass(user) as unknown) as AppUser);

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


/**
 * 
 * @param userId The id of the user
 * @param actor The currently logged in user
 * @throws AxiosError
 * @returns Promise<UserInfo | null>
 */
const fetchUserById = async (userId: string, actor: AppUser): Promise<UserInfo | null> => {
    const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', userId);
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${actor.token}`
        }
    });

    return res.data.data || null;
}


const useGetUserById = (userId: string, actor: AppUser, raw: boolean = false):
    [
        isLoading: boolean,
        user: AppUser | UserInfo | null,
        error: any
    ] => {
    const [user, setUser] = useState<AppUser | UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchUser = async (userId: string, actor: AppUser) => {
        setIsLoading(true);
        try {
            const rawData = await fetchUserById(userId, actor);
            const processedData = rawData?.id ? new UserClass(rawData) : null;

            if (raw) {
                setUser(rawData);
            } else {
                setUser(processedData as any);
            }
        } catch (err) {
            setError(err as any);
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
    [isLoading: boolean, users: AppUser[] | null, error: any] => {
    const [users, setUsers] = useState<AppUser[] | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (actor == null) {
            return;
        }
        if (eventId == '*') {
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

                if (data.accounts) {
                    const appUsers = data.accounts.map((user: unknown) => new UserClass(user as UserInfo));
                    setUsers(appUsers);
                }
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [eventId, actor]);

    return [isLoading, users, error];
}

const getAuthenticatedUserFullData = async (email: string, token: string): Promise<UserInfo | null> => {

    const url = Api.server + Api.endpoints.admin.search + '?email=' + email;
    let result: { data: { accounts: [] } } | null = null;
    let user: UserInfo | null = null;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        result = response.data;

        if (result?.data && result?.data.accounts) {
            user = result.data.accounts.shift() || null;
        }
    } catch (error) {
        console.log(error)
    }

    return user;
}

const useGetUserProperties = (userId: string, actor: AuthInfo):
    [user: AppUser | null, events: SingleEvent[], isLoading: boolean, error: any] => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [events, setEvents] = useState<SingleEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const usersSrc = Api.server + Api.endpoints.admin.singleUser.replace(':id', userId);

    useEffect(() => {
        const fetchUserEvents = async (res: AxiosResponse) => {
            const data: AppUser = res.data.data;
            setUser(data);

            const fetchedEvents = useGetEventsByIds(data.eventRef, actor as any);
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

const useGetUserTeams = (user: AppUser | null, actor: AppUser | null, ignoreError: boolean = false): [isLoading: boolean, teams: Record<string, any>[], error: any] => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [teams, setTeams] = useState<Record<string, any>[]>([]);
    const [error, setError] = useState<any>(null);

    const fetchTeams = async (userId: string, actor: AppUser) => {
        const userEvents = await fetchUserEvents(userId, actor) as any;
        if (userEvents instanceof Error) {
            setError(userEvents);
            setIsLoading(false);
            return;
        }
        if (!userEvents?.length) {
            setIsLoading(false);
            return;
        }
        const eventIds: string[] = userEvents.map((event: SingleEvent) => event._id);

        // const fetchUsersByEventId = async (eventId: string) => {
        //     const url = Api.server + Api.endpoints.admin.search + '?eventRef=' + eventId;
        //     const res = await axios.get(url, {
        //         headers: {
        //             Authorization: `Bearer ${actor?.token}`
        //         }
        //     });
        //     const data = res.data.data || {};
        //     return { [eventId]: data.accounts || [] };
        // }

        try {
            const batchResponse = await Promise.all(eventIds.map(
                async id => {
                    return { [id]: await fetchUsersByEventId(id, actor as AppUser) };
                }
            ));
            batchResponse.forEach((data) => {
                for (const [key, value] of Object.entries(data)) {
                    setTeams(state => ([...state, {
                        eventId: key,
                        eventTitle: (userEvents.find((ev: SingleEvent) => ev._id === key)).title,
                        teamMembers: value
                    }]));
                }
            })
        } catch (err) {
            setError(err);
            if (!ignoreError) {
                console.error(error)
            }
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (user === null || actor === null) {
            return;
        }

        fetchTeams(user.id, actor);

        return function cleanup() {

        }
    }, [user, actor]);

    return [isLoading, teams, error];
}

const useGetTeamMembers = (user: AppUser | null, actor: AppUser | null):
    [
        isLoading: boolean,
        teamMembers: UserInfo[] | [],
        error: any
    ] => {

    const [teamMembers, setTeamMembers] = useState<UserInfo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const [teamsLoading, teams, teamsError] = useGetUserTeams(user, actor);

    useEffect(() => {
        setIsLoading(teamsLoading);

        if (!teamsLoading) {
            if (teamsError != null) {
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
    dissociateUserFromEvent,
    fetchUserById,
    fetchUsersByEventId,
    useGetUsers,
    useGetUserById,
    useGetUsersByEvent,
    getAuthenticatedUserFullData,
    useGetUserProperties,
    useGetUserTeams,
    useGetTeamMembers
}