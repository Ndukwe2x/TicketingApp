'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FiPlus, FiMinus } from 'react-icons/fi';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BiCartAdd } from 'react-icons/bi';
import { formatCurrency } from '@/lib/utils';
import { createContext, useContext, useState } from 'react';
import { Text } from '@/components/ui/text';

type ReserveSpotCardContextType = {
    selectedTicket: TicketCategory | undefined;
    setSelectedTicket: React.Dispatch<React.SetStateAction<string>>;
    count: number;
    setCount: React.Dispatch<React.SetStateAction<number>>;
};
const ReserveSpotCardContext = createContext({} as ReserveSpotCardContextType);
const useReserveSpotCard = () => useContext(ReserveSpotCardContext);

export default function ReserveSpotCard({ event }: { event: SingleEvent }) {
    const [selectedTicketType, setSelectedTicketType] = useState('');
    const [count, setCount] = useState(1);
    const ticketCategories = event.ticketCategories || []

    const selectedTicket = ticketCategories.find((type) => type.name === selectedTicketType);
    const setSelectedTicket = (value: string | ((value: string) => string)) => {
        setSelectedTicketType(value);
        setCount(1);
    };

    const ticketPrice = !selectedTicket?.price ? 0 : selectedTicket.price * count;

    return (
        <ReserveSpotCardContext.Provider
            value={{ selectedTicket, setSelectedTicket, count, setCount }}
        >
            <Card className='flex flex-col min-w-80 shadow-[rgba(0,0,15,0.1)_0_-4px_6px_1px] md:shadow-md'>
                <CardContent className='pt-4 pb-2'>
                    <SelectTicket categories={ ticketCategories } />
                    <Text variant='h4' className='text-end'>
                        {selectedTicket?.price == (0 || undefined) ? 'FREE' : formatCurrency(Number(selectedTicket?.price))}
                    </Text>
                </CardContent>
                <CardFooter className='flex-col gap-1'>
                    <Button className='gap-2 w-full' disabled={!selectedTicket || !count}>
                        <BiCartAdd className='h-6 w-6' />
                        Buy Ticket{count > 1 && 's'}
                    </Button>
                </CardFooter>
            </Card>
        </ReserveSpotCardContext.Provider>
    );
}

const Counter = () => {
    const { count, setCount, selectedTicket } = useReserveSpotCard();
    const max = selectedTicket?.qty || 1;

    return (
        <div className='flex items-center gap-1'>
            <Button
                variant='outline'
                size='icon'
                onClick={() => setCount((prev) => (prev > 1 ? count - 1 : prev))}
                disabled={!selectedTicket}
            >
                <FiMinus />
            </Button>
            <Text className='w-5 text-center'>{count}</Text>
            <Button
                variant='outline'
                size='icon'
                onClick={() => setCount((prev) => (prev < max ? count + 1 : prev))}
                disabled={count === max || !selectedTicket}
            >
                <FiPlus />
            </Button>
        </div>
    );
};

const SelectTicket = ({categories}: {categories: TicketCategory[]}) => {
    const { selectedTicket, setSelectedTicket } = useReserveSpotCard();

    return (
        <div className='flex justify-between items-center gap-5 w-full mb-2'>
            <Select value={selectedTicket?.name ?? ''} onValueChange={setSelectedTicket}>
                <SelectTrigger className='[&>span]:line-clamp-2 h-fit focus:ring-0 px-0 border-0 rounded-none shadow-none'>
                    <SelectValue placeholder='Select a ticket' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {categories.map((type) => (
                            <SelectItem
                                disabled={type.qty === 0}
                                key={type.name}
                                value={type.name}
                            >
                                <Text variant='h4' className='text-left'>
                                    {type.name}
                                </Text>
                                <Text asLabel>
                                    {type.qty} {type.qty === 1 ? 'ticket' : 'tickets'}
                                    &nbsp;left
                                </Text>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Counter />
        </div>
    );
};

