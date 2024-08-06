"use client";

import NotFoundPage from "@/app/[...not-found]/page";
import MyEvents from "@/components/dashboard/my-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { fetchUsers, getCookieUser, useGetUserById } from "@/hooks/useGetUsers";
import React from "react";

// export async function generateStaticParams(): Promise<{ userId: string; }[]> {
//     const loggedUser = getCookieUser();
//     const users: UserInfo[] = await fetchUsers(loggedUser);

//     return users.map(user => ({
//         userId: user.id.toString(),
//     }));
// }

const Profile = () => {
    const actor = useAuthenticatedUser();
    const [eventsLayout, setEventsLayout] = React.useState('table');

    return (
        actor && (
            <Card>
                <CardHeader>
                    <CardTitle>
                        My Events
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <MyEvents layout={eventsLayout}
                        isFilteringEnabled={true}
                        filterParams={[]}
                        gridColumnRule={{ lg: 2, xl: 2, xxl: 3 }}
                        owner={actor} />
                </CardContent>
            </Card>
        )
    )
}

export default Profile;