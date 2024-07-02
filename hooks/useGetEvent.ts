import { Api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
    const url = Api.server + Api.endpoints.admin.event.replace(':id', eventId);
    try {
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


