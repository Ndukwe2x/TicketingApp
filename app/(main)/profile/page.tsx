"use client";

import NotFoundPage from "@/app/[...not-found]/page";
import ToggleView from "@/components/buttons/viewtype-toggle";
import MyEvents from "@/components/dashboard/my-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
// import { fetchUsers, getCookieUser, useGetUserById } from "@/hooks/useGetUsers";
import React, { useState } from "react";

// export async function generateStaticParams(): Promise<{ userId: string; }[]> {
//     const loggedUser = getCookieUser();
//     const users: UserInfo[] = await fetchUsers(loggedUser);

//     return users.map(user => ({
//         userId: user.id.toString(),
//     }));
// }

const Profile = () => {
    const actor = useAuthenticatedUser();
    const [eventsLayout, setEventsLayout] = useState<ViewType>('list');

    return (
        actor && (
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>
                        My Events
                    </CardTitle>
                    <ToggleView dataSetId="events" setExternalViewType={setEventsLayout} />
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