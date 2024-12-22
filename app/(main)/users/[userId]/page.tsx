"use client";

import NotFoundPage from "@/app/not-found";
// import NotFoundPage from "@/app/[...not-found]/page";
import ToggleView from "@/components/buttons/viewtype-toggle";
import MyEvents from "@/components/dashboard/my-events";
import UserSearchForm from "@/components/dashboard/user-search-form";
import RenderPrettyError from "@/components/render-pretty-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { fetchUsers, getCookieUser, useGetUserById } from "@/hooks/useGetUsers";
import { isAxiosError } from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import LoadingUserProfile from "./loading";
import ProfileCard from "@/components/profile/profile-card";
import ProfileHeader from "@/components/profile/header";
import { cn } from "@/lib/utils";
import { usePageHeader } from "@/hooks/usePageHeaderContext";
import Link from "next/link";

// export async function generateStaticParams(): Promise<{ userId: string; }[]> {
//     const loggedUser = getCookieUser();
//     const users: UserInfo[] = await fetchUsers(loggedUser);

//     return users.map(user => ({
//         userId: user.id.toString(),
//     }));
// }

const Profile = ({ params }: { params: { userId: string } }) => {
    const { userId } = params;
    const actor = useAuthenticatedUser();
    const [eventsLayout, setEventsLayout] = useState<ViewType>('list');
    const [isLoading, user, error] = useGetUserById(userId, actor as AppUser, true);
    const { setPageTitle, setWidget } = usePageHeader();

    useEffect(() => {
        setPageTitle(null);
        if (!actor) {
            return;
        }
        if (actor.canViewTeamMembers) {
            setWidget((
                <React.Fragment>
                    <div className='flex items-end gap-3 ml-auto'>
                        <Link href={actor.isOwner ? '/users' : '/team'} className={
                            cn('border border-primary disabled:opacity-50 disabled:pointer-events-none',
                                'flex focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                'font-medium gap-2 h-9 hover:bg-primary hover:text-white items-center',
                                'justify-center lg:px-4 md:px-2 px-2 py-2 rounded-md shadow-sm text-primary',
                                'text-sm transition-colors whitespace-nowrap')
                        }>Users</Link>
                    </div>
                </React.Fragment>
            ));
        }
    }, [actor, setPageTitle, setWidget]);

    // return (
    //     user && (
    // <Card>
    //     <CardHeader className="flex-row items-center justify-between">
    //         <CardTitle>
    //             {`${user.firstname}'s Events`}
    //         </CardTitle>
    //         <ToggleView dataSetId="events" setExternalViewType={setEventsLayout} />
    //     </CardHeader>
    //     <CardContent>
    //         <MyEvents layout={eventsLayout}
    //             isFilteringEnabled={true}
    //             filterParams={[]}
    //             gridColumnRule={{ lg: 2, xl: 2, xxl: 3 }}
    //             owner={user} />
    //     </CardContent>
    // </Card>
    //     )
    // )
    let output: ReactNode = '';

    if (isLoading) {
        // output = <LoadingUserProfile />
    } else if (user) {
        output = <React.Fragment>
            <header id='profile-header' className='flex flex-col header w-full'>
                <div className='flex flex-col gap-3 relative px-4 lg:px-8'>
                    <ProfileHeader account={user} />
                </div>
            </header>
            <div id='profile-body' className='px-4 lg:px-8'>
                <aside className='sidebar'>
                    {user != null && <ProfileCard user={user} />}
                </aside>
                <main className='major'>
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>
                                {`${user.firstname}'s Events`}
                            </CardTitle>
                            <ToggleView dataSetId="events" setExternalViewType={setEventsLayout} />
                        </CardHeader>
                        <CardContent>
                            <MyEvents layout={eventsLayout}
                                isFilteringEnabled={true}
                                filterParams={[]}
                                gridColumnRule={{ lg: 2, xl: undefined, xxl: undefined }}
                                owner={user} />
                        </CardContent>
                    </Card>
                </main>
            </div>
        </React.Fragment>
    } else {
        if (isAxiosError(error)) {
            if (error.code === "404") {
                output = <React.Fragment>
                    <NotFoundPage heading="User Not Found!" text="Sorry, but we could't find the user you're looking for." />
                    <div id="search-bar" className="mt-10">
                        <div className="lg:w-5/6 mx-auto">
                            <Text variant='h4' className="my-4">Search users, enter firstname or lastname.</Text>
                            <UserSearchForm />
                        </div>
                    </div>
                </React.Fragment>
            } else {
                output = <RenderPrettyError error={error} />
            }
        }
    }

    return output;
}

export default Profile;