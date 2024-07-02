import UserClass from "@/lib/User.class";
import { NextRequest, NextResponse } from "next/server";
import { AuthFreeRoutes } from "./lib/app-routes";

export default function middleware(req: NextRequest) {

    const url = req.nextUrl.clone();
    const sessionUser = req.cookies.get('app_user');
    let pathname = url.pathname.slice(1);
    if (pathname.endsWith('/')) {
        pathname = pathname.slice(0, pathname.length - 1);
    }

    const routeParts: string[] = pathname.length
        ? url.pathname.slice(1, url.pathname.length).split('/')
        : [];

    if (routeParts.length < 1 && !sessionUser?.value) {
        url.pathname = '/login';
        url.search = '';
        return NextResponse.redirect(url);
    }

    let entryRoute: string = <string>routeParts[0];
    if (entryRoute && !entryRoute.startsWith('/')) {
        entryRoute = '/' + entryRoute;
    }
    if (entryRoute && !sessionUser?.value && !AuthFreeRoutes.includes(entryRoute)) {
        url.pathname = '/login/';
        url.search = '?redir=' + req.nextUrl.pathname;
        return NextResponse.redirect(url);
    }

    let userInfo = <UserInfo>(sessionUser?.value ? JSON.parse(sessionUser?.value) : {});

    if (!userInfo.id) {
        if (!AuthFreeRoutes.includes(entryRoute)) {
            url.pathname = '/login';
            url.search = '?redir=' + req.nextUrl.pathname;
            return NextResponse.redirect(url);
        }
    } else if (url.pathname.startsWith('/login')) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    const appUser = new UserClass(userInfo as UserInfo);
    if (url.pathname.startsWith('/users') && !appUser.isOwner) {
        url.pathname = url.pathname.replace('/users', '/team');
        return NextResponse.redirect(url);
    }

    return NextResponse.next();

}