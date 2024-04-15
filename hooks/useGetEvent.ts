import NotFoundPage from '@/app/(main)/dashboard/[...not-found]/page';
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

    // if (!(user && user.token)) {
    //     // return NotFoundPage();
    //     // return null;
    // }
    
    url.replace(':id', id);
    await axios.get(url, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    })
    // return dummyEvents.find((event) => event.id === id);
};
