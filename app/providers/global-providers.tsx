'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageHeaderProvider from '../page-header-provider';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DataPasserProvider } from './data-passer-provider';
import AppDataProvider from './app-data-provider';
// import { AppProps } from 'next/app';

const queryClient = new QueryClient();

export function GlobalProviders({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {/* <DataPasserProvider>
            </DataPasserProvider> */}
            <AppDataProvider>
                <PageHeaderProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {children}
                    </LocalizationProvider>
                </PageHeaderProvider>
            </AppDataProvider>
        </QueryClientProvider>
    )
}
