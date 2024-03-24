'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';
import { IoTicket } from 'react-icons/io5';

export function AppLogo({ color = 'primary' }: { color?: 'primary' | 'white' }) {
    return (
        <div
            className={cn(
                'flex items-center gap-2',
                color === 'primary' ? 'text-primary' : 'text-white'
            )}
        >
            <IoTicket size={25} />
            <span className='font-semibold'>Tickets</span>
        </div>
    );
}
