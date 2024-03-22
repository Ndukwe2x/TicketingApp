import React from 'react';
import { BiChevronRight } from 'react-icons/bi';
import { cn, formatCurrency } from '@/lib/utils';
import { Text } from '@/components/ui/text';

export function PriceTag({ price }: { price: number }) {
    return (
        <div
            className={cn(
                'group w-fit flex items-center gap-2 my-4',
                // 'border border-primary rounded-full p-2 pr-3'
            )}
        >
            <BiChevronRight size={20} className='group-hover:translate-x-1 transition-all text-xl' />
            <Text className='font-semibold'>{formatCurrency(price)}</Text>
        </div>
    );
}
