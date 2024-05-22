import NotFoundPage from '@/app/(main)/dashboard/[...not-found]/page';
import { Api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useuseGetEventById = (id: string, user: AuthInfo) => {
    const eventQuery = useQuery({ queryKey: ['events', id], queryFn: () => useGetEventById(id, user) });

    const { data, ...rest } = eventQuery;

    return {
        ...rest,
        event: data,
    };
};

export const useGetEventById = async (id: string, user: AuthInfo) => {
    
    const url = Api.server + Api.endpoints.admin.event;
    
    url.replace(':id', id);
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    })
    return response.data;
};
