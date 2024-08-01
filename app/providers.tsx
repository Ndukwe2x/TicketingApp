'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageHeaderProvider from './page-header-provider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <PageHeaderProvider>
                {children}
            </PageHeaderProvider>
        </QueryClientProvider>
    )
}
