"use client";

import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { Session } from "@/lib/session";

export default function Logout() {
    
    Session.forgetUser();
    location.assign('/login?logged_out=1');

    return (
        <></>
    )
}