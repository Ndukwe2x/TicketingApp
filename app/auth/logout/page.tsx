"use client";

import { APPCONFIG } from "@/lib/app-config";
import { User } from "@/lib/logged-user";
import { deleteCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();
    const route = usePathname();
    const user = User();
    deleteCookie('app_user', APPCONFIG.cookieOptions);
        
    router.push('/login');

    return (
        <></>
    )
}