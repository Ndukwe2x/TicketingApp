"use client";

import React, { memo, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Text } from "../ui/text";
import { useGetUserTeams } from "@/hooks/useGetUsers";
import { useGetEventsByIds, useGetEventsByUser } from "@/hooks/useGetEvents";
import Avatar from '@/components/profile/avatar';
import { cn, formatDate } from "@/lib/utils";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { useDataPasserContext } from "@/hooks/useCustomContexts";
import { DataPasserProvider } from "@/app/providers/data-passer-provider";
import { Skeleton } from "../ui/skeleton";

interface CompProps {
    user: AppUser | UserInfo;
}
const ProfileCard: React.FC<React.HTMLAttributes<HTMLDivElement> & CompProps> = ({ user }) => {

    const actor = useAuthenticatedUser();

    const [isEventsLoading, events, eventsError] = useGetEventsByUser(user as AppUser, actor as AppUser, true);
    const [isTeamsLoading, teams, teamsError] = useGetUserTeams(user as AppUser, actor as AppUser, true);
    const [teamMembers, setTeamMembers] = useState<AppUser[]>([]);
    // const [totalEvents, setTotalEvents] = useState<number | string>('Unverified');
    // const [totalTeamMembers, setTotalTeamMembers] = useState<number | string>('Unverified');

    useEffect(() => {
        if (!teams.length) {
            return;
        }
        for (const eachTeam of teams) {
            setTeamMembers(state => [...state, ...eachTeam.teamMembers]);
        }
    }, [teams]);

    // useEffect(() => {
    //     if (events.length) {
    //         setTotalEvents(events.length);
    //     }
    //     if (teamMembers.length) {
    //         setTotalTeamMembers(teamMembers.length);
    //     }
    // }, [events, teamMembers]);

    return (
        user &&
        <DataPasserProvider data={{ user }}>
            <Card>
                <CardContent>
                    <Avatar user={user as AppUser} size={100} className="profile-card-avatar" />
                    <div className='grid grid-cols-2 gap-5'>
                        <div className="flex flex-col items-center">
                            <Text variant='h4' className="responsive-text">Events</Text>
                            <RenderDataCount data={events} isPending={isEventsLoading} isError={eventsError !== null} />
                        </div>
                        <div className="flex flex-col items-center">
                            <Text variant='h4' className="responsive-text">Team Members</Text>
                            {actor?.isUser ? (
                                <RenderDataCount data={teamMembers} isPending={isTeamsLoading} isError={teamsError !== null} />
                            ) : (
                                <span className="text-red-800 text-sm">N/A</span>
                            )}
                        </div>
                    </div>
                    <hr className="my-3" />
                    <div>
                        <Text variant='h3' className="mb-3">Contact Info</Text>
                        <div className="flex gap-3 flex-col">
                            <Text variant='h4'>
                                <span className="inline-block w-1/3">Email:</span>
                                <span className="text-sm">{user.email}</span>
                            </Text>
                            <Text variant='h4'>
                                <span className="inline-block w-1/3">Phone:</span>
                                <span className="text-sm">{user.phone}</span>
                            </Text>
                            {
                                (user as AppUser).isOwner &&
                                <Text variant='h4'>
                                    <span className="inline-block w-1/3">User Type:</span>
                                    <span className="text-sm">{user.accountType}</span>
                                </Text>
                            }
                            <Text variant='h4'>
                                <span className="inline-block w-1/3">Role:</span>
                                <span className="text-sm">{user.role}</span>
                            </Text>
                            <Text variant='h4'>Registered on: <span className="text-sm">{formatDate(new Date(user.createdAt), 'DD MMMM, YYYY at HH:MM A')}</span></Text>
                        </div>
                    </div>
                </CardContent>
            </Card >
        </DataPasserProvider>
    )
}

export default memo(ProfileCard);

function RenderDataCount(
    { children, className, data, isPending, isError = false, ...props }:
        React.HTMLAttributes<HTMLSpanElement> & { data: Record<string, any>[], isPending: boolean, isError?: boolean }) {
    // const { data } = useDataPasserContext();
    // const { user } = data as Record<string, AppUser>;
    // const actor = useAuthenticatedUser();
    // const [isEventsLoading, events, error] = useGetEventsByUser(user as AppUser, actor as AppUser, true);

    return (
        isPending ? (
            <Skeleton className={
                cn('animate-spin bg-transparent border-b border-l border-t h-3.5 rounded-full w-3.5')
            } />
        ) : (
            <span className={cn('counter text-sm', !data.length ? 'text-red-800' : '')} {...props}>
                {isError ? 'Unverified' : data.length}
            </span>
        )
    )
}