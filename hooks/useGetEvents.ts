import { dummyEvents } from '@/lib/data';
import { useQuery } from '@tanstack/react-query';

export const useGetEvents = () => {
    const eventQuery = useQuery({ queryKey: ['events'], queryFn: getEvents });

    const { data, ...rest } = eventQuery;

    const featuredEvents = data?.filter((event) => event.featured);
    const liveEvents = data?.slice(0, 3);

    return {
        ...rest,
        events: data,
        featuredEvents,
        liveEvents,
    };
};

const getEvents = async () => {
    return dummyEvents;
};
