'use client';

import { APPCONFIG } from '@/lib/app-config';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { IoTicket } from 'react-icons/io5';

export function AppLogo({ color = 'primary', shadow = null }: { color?: 'primary' | 'white' | 'dark'; shadow?: 'dark' | 'light' | null }) {
    const { title } = APPCONFIG;
    return (
        <div
            className={cn(
                'flex items-center justify-center gap-2',
                `text-${color}`,
                shadow ? `text-shadow[${shadow}]` : ''
            )}
        >
            <IoTicket size={25} />
            <span className='font-semibold'>{title}</span>
        </div>
    );
}
