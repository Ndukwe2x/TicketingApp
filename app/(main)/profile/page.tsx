"use client";

import NotFoundPage from "@/app/[...not-found]/page";
import ToggleView from "@/components/buttons/viewtype-toggle";
import MyEvents from "@/components/dashboard/my-events";
import ProfileCard from "@/components/profile/profile-card";
import ProfileHeader from "@/components/profile/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { cn } from "@/lib/utils";
// import { fetchUsers, getCookieUser, useGetUserById } from "@/hooks/useGetUsers";
import React, { useEffect, useState } from "react";
import LoadingUserProfile from "./loading";
import { usePageHeader } from "@/hooks/usePageHeaderContext";

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
    const { setPageTitle } = usePageHeader();

    useEffect(() => {
        setPageTitle(null);
    }, [setPageTitle]);

    // return (
    //     actor && (
    //         <Card>
    //             <CardHeader className="flex-row items-center justify-between">
    //                 <CardTitle>
    //                     My Events
    //                 </CardTitle>
    //                 <ToggleView dataSetId="events" setExternalViewType={setEventsLayout} />
    //             </CardHeader>
    //             <CardContent>
    //                 <MyEvents layout={eventsLayout}
    //                     isFilteringEnabled={true}
    //                     filterParams={[]}
    //                     gridColumnRule={{ lg: 2, xl: 2, xxl: 3 }}
    //                     owner={actor} />
    //             </CardContent>
    //         </Card>
    //     )
    // )
    return (
        actor ? (
            <React.Fragment>
                <header id='profile-header' className='flex flex-col header w-full'>
                    <div className='flex flex-col gap-3 relative px-4 lg:px-8'>
                        <ProfileHeader account={actor} />
                    </div>
                </header>
                <div id='profile-body' className='px-4 lg:px-8'>
                    <aside className='sidebar'>
                        {actor != null && <ProfileCard user={actor} />}
                    </aside>
                    <main className='major'>
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
                    </main>
                </div>
            </React.Fragment>
        ) : (
            <LoadingUserProfile />
        )
    )
}

export default Profile;