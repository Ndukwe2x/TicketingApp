"use client";

import MyEvents from "@/components/dashboard/my-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { useGetUserById } from "@/hooks/useGetUsers";
import React from "react";

const Profile = ({ params }: { params: { userId: string } }) => {
    const { userId } = params;
    const actor = useAuthenticatedUser();
    const [eventsLayout, setEventsLayout] = React.useState('table');
    const [isLoading, user] = useGetUserById(userId, actor as AppUser, true);

    return (
        user != null &&
        <Card>
            <CardHeader>
                <CardTitle>
                    {`${user.firstname}'s Events`}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <MyEvents layout={eventsLayout}
                    isFilteringEnabled={true}
                    filterParams={[]}
                    owner={user} />
            </CardContent>
        </Card>
    )
}

export default Profile;