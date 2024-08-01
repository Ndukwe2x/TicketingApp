"use client";

import React, { Suspense } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { DataTable, DataTableLoading } from '@/components/ui/data-table';
import { columns } from '@/components/dashboard/table-columns/users';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { useGetUserTeams } from '@/hooks/useGetUsers';

export default function Users() {
    const actor = useAuthenticatedUser();
    const [isLoading, teams, error] = useGetUserTeams(actor, actor);

    return (
        teams ? (
            <div className='flex flex-col gap-5'>
                {
                    Array.from(teams).map((team, index) => (
                        <Card key={index}>
                            <CardContent className='pt-5'>
                                <CardTitle className='mb-3'>Team <span className='text-primary'>{team.eventTitle}</span></CardTitle>
                                <DataTable
                                    columns={columns}
                                    data={team.teamMembers}
                                    fallback='Fetching team members...' />
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        ) : (
            <div className='text-center'>{"No team member. Click on 'Add Team Member' to add a new Team member"}</div>
        )
    );
}
