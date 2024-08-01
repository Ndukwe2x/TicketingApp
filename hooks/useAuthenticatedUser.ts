"use client";

import * as CookiesNext from "cookies-next";
import { Session } from "@/lib/session";
import UserClass from "@/lib/User.class";
import { useEffect, useState } from "react";

// This hook provides the information of the logged in user as stored in the session
// upon a successful authentication
const useAuthenticatedUser = (callback?: <T = AppUser | null>(user: T) => void): AppUser | null => {
    const [user, setUser] = useState<AppUser | null>(null);
    // The JSON.stringify() and the dummy user data object passed to it must be replaced
    // with a real resource that returns a json string with the same structure.
    useEffect(() => {
        const cookieInfo: string | CookiesNext.CookieValueTypes = Session.getUser();
        const authUser = cookieInfo === undefined ? cookieInfo : JSON.parse(cookieInfo);
        if (callback) {
            callback(authUser ? new UserClass(authUser) : null);
        }
        if (authUser) {
            const classified = <AppUser>(new UserClass(authUser) as unknown);
            setUser(classified);
        }
    }, []);

    return user;
}

export default useAuthenticatedUser;
