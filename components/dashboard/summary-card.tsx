import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import { Text } from '@/components/ui/text';
import { Skeleton } from '../ui/skeleton';

type SummaryCardProps = {
    summary: { title: string; value: string; label?: string; icon: React.ReactNode };
};

export function SummaryCard({ summary }: SummaryCardProps) {
    return (
        <Card className=''>
            <CardHeader className='pb-2 flex-row items-center justify-between gap-2'>
                <Text variant='h4' className=''>
                    {summary.title}
                </Text>
                <span>{summary.icon}</span>
            </CardHeader>
            <CardContent className=''>
                <Text variant='h3' className=''>
                    {summary.value}
                </Text>
                <Text asLabel className='text-xs'>
                    {summary.label}
                </Text>
            </CardContent>
        </Card>
    );
}

export function SummaryCardLoading() {
    return (
        <div className='relative'>
            <Skeleton className='absolute h-32 w-full' />
            <div className='p-6'>
                <Skeleton className='h-4 w-2/3' />
                <Skeleton className='h-8 w-1/3 my-2' />
                <Skeleton className='h-3 w-1/2' />
            </div>
        </div>
    );
}
