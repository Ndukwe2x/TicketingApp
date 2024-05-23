"use client";

import { User } from "@/lib/logged-user";
import { Session } from "@/lib/session";
import { usePathname, useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();
    const route = usePathname();
    const user = User;
    
    Session.forgetUser();
    location.assign('/login?logged_out=1');

    return (
        <></>
    )
}