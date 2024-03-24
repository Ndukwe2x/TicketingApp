"use client";

import * as React from 'react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { Session } from '@/lib/session';
import { useRouter } from "next/navigation";
import { SmokeScreen } from '@/components/smokescreen';

export default function Layout({ children }: { children: React.ReactNode }) {
    // const router = useRouter();
    // const summary = await getDashboardSummary();
    // const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    // React.useEffect(() => {
    //     setIsAuthenticated(Session.isAuthenticated());
    // }, []);
    
    return (
        <div className='flex relative'>
            <DashboardNav />
            <div className='flex-1 pl-3 lg:pl-10 overflow-y-auto pb-10'>{children}</div>
            {/* <SmokeScreen /> */}
        </div>
    );
}
