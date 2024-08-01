"use client";

import React, { memo, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Text } from "../ui/text";
import { useGetUserTeams } from "@/hooks/useGetUsers";
import { useGetEventsByIds, useGetEventsByUser } from "@/hooks/useGetEvents";
import Avatar from '@/components/profile/avatar';
import { formatDate } from "@/lib/utils";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";

interface CompProps {
    user: AppUser | UserInfo;
}
const ProfileCard: React.FC<React.HTMLAttributes<HTMLDivElement> & CompProps> = ({ user }) => {

    const actor = useAuthenticatedUser();

    const [isEventsLoading, events, error] = useGetEventsByUser(user as AppUser, actor as AppUser);
    const [teams] = useGetUserTeams(user as AppUser, actor as AppUser);
    const [teamMembers, setTeamMembers] = useState<AppUser[]>([]);

    useEffect(() => {
        for (const [key, value] of Object.entries(teams)) {
            setTeamMembers(state => [...state, ...value]);
        }
    }, [teams])

    return (
        events && !isEventsLoading &&
        <Card>
            <CardContent>
                <Avatar user={user as AppUser} size={100} className="profile-card-avatar" />
                <div className='grid grid-cols-2 gap-5'>
                    <div className="flex flex-col items-center">
                        <Text variant='h4' className="responsive-text">Events</Text>
                        <span className='counter'>{events.length}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Text variant='h4' className="responsive-text">Team Members</Text>
                        <span>{teamMembers.length}</span>
                    </div>
                    {/* <div className="flex flex-col items-center">
                        <Text variant='h4' className="responsive-text">Events</Text>
                        <span>5</span>
                    </div> */}
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
        </Card>
    )
}

export default memo(ProfileCard);