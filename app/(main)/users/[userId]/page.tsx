"use client";

import MyEvents from "@/components/dashboard/my-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useGetUserProperties } from "@/hooks/useGetUsers";
import UserClass from "@/lib/User.class";
import { User } from "@/lib/logged-user";
import React from "react";

const Profile = ({ params }: { params: { userId: string } }) => {
    const { userId } = params;
    const actor = User;
    const [eventsLayout, setEventsLayout] = React.useState('table');
    const [user, isLoading, error, events] = useGetUserProperties(userId, actor);
    
    return (
        user &&
        <>
            {/* <Card className="mb-4 lg:mb-7">
                <CardHeader>
                    
                </CardHeader>
                <CardContent>
                    
                </CardContent>
            </Card> */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Events
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <MyEvents layout={ eventsLayout }
                        isFilteringEnabled={true}
                        filterParams={[]}
                        owner={ new UserClass(user) } />
                </CardContent>
            </Card>
        </>
    )
}

export default Profile;