import React, { memo } from "react";
import { Card, CardContent } from "../ui/card";
import { Text } from "../ui/text";
import { useGetUserProperties } from "@/hooks/useGetUsers";
import { User } from "@/lib/logged-user";
import { useGetEventsByUser } from "@/hooks/useGetEvents";
import Avatar from '@/components/profile/avatar';
import UserClass from "@/lib/User.class";

interface CompProps {
    user: AppUser;
}
const ProfileCard: React.FC<React.HTMLAttributes<HTMLDivElement> & CompProps> = ({user}) => {

    const actor = User;
    // const [user, events, ...rest] = useGetUserProperties(userId, actor);
    const [events] = useGetEventsByUser(user, actor);

    return (
        events && 
        <Card>
            <CardContent>
                <Avatar user={ user } size={ 100 } className="profile-card-avatar" />
                <div className='grid grid-cols-3 gap-5'>
                    <div className="flex flex-col items-center">
                        <Text variant='h4'>Events</Text>
                        <span className='counter'>{ user.eventRef.length }</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Text variant='h4'>Team</Text>
                        <span>5</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Text variant='h4'>Events</Text>
                        <span>5</span>
                    </div>
                </div>
                <hr className="my-3" />
                <div>
                    <Text variant='h3' className="mb-3">Contact Info</Text>
                    <div className="flex gap-3 flex-col">
                        <Text variant='h4'>
                            <span className="inline-block w-1/3">Email:</span>
                            <span className="text-sm">{ user.email }</span>
                        </Text>
                        <Text variant='h4'>
                            <span className="inline-block w-1/3">Phone:</span>
                            <span className="text-sm">{ user.phone }</span>
                        </Text>
                        <Text variant='h4'>
                            <span className="inline-block w-1/3">User Type:</span>
                            <span className="text-sm">{ user.userStatus || (user.isOwner) }</span>
                        </Text>
                        <Text variant='h4'>
                            <span className="inline-block w-1/3">Role:</span>
                            <span className="text-sm">{ user.userRole }</span>
                        </Text>
                        {/* <Text variant='h4'>Email: <small>{ user.email }</small></Text> */}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default memo ( ProfileCard );