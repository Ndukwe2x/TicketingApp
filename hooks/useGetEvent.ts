import { dummyEvents } from '@/lib/data';
import { useQuery } from '@tanstack/react-query';

export const useGetEventById = (id: string) => {
    const eventQuery = useQuery({ queryKey: ['events', id], queryFn: () => getEventById(id) });

    const { data, ...rest } = eventQuery;

    return {
        ...rest,
        event: data,
    };
};

export const getEventById = async (id: string) => {
    await new Promise((resolve)=> {
        setTimeout(() => {
            resolve(true)
        }, 2000)
    })
    return dummyEvents.find((event) => event.id === id);
};
