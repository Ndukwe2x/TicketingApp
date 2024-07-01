"use client";

import * as CookiesNext from "cookies-next";
import { Session } from "./session";
import UserClass from "./User.class";

// This module provide the information of the logged in user as stored in the session
// upon a successful authentication
const userInfo = (): AppUser | null => {
    let user: AppUser | null = null;
    // The JSON.stringify() and the dummy user data object passed to it must be replaced
    // with a real resource that returns a json string with the same structure.
    const cookieInfo: string | CookiesNext.CookieValueTypes = Session.getUser();


    const authUser = cookieInfo === undefined ? undefined : JSON.parse(cookieInfo);

    if (authUser) {
        //     userInfo.isSuper =  userInfo.user.userRole === 'Super';
        //     userInfo.isRegular =  userInfo.user.userRole === 'Regular';
        //     userInfo.isBasic =  userInfo.user.userRole === 'Basic';
        //     userInfo.isOwner =  userInfo.user.userStatus === 'owner';
        //     userInfo.isSuperOwner =  userInfo.isOwner && userInfo.isSuper;
        //     userInfo.isRegularOwner =  userInfo.isOwner && userInfo.isRegular;
        //     userInfo.isBasicOwner =  userInfo.isOwner && userInfo.isBasic;
        //     userInfo.isUser =  userInfo.user.userStatus === 'user';
        //     userInfo.isSuperUser =  userInfo.isUser && userInfo.isSuper;
        //     userInfo.isRegularUser =  userInfo.isUser && userInfo.isRegular;
        //     userInfo.isBasicUser =  userInfo.isUser && userInfo.isBasic;
        //     userInfo.canCreateUser =  userInfo.isSuperOwner || userInfo.isSuperUser;
        //     userInfo.canUpdateUser =  userInfo.isSuperOwner || userInfo.isRegularOwner || userInfo.isSuperUser
        //     userInfo.canDeleteUser =  userInfo.isSuperOwner || userInfo.isRegularOwner || userInfo.isSuperUser;
        //     userInfo.canCreateEvent =  userInfo.isSuperOwner || userInfo.isSuperUser;
        //     userInfo.canUpdateEvent =  userInfo.isSuperOwner || userInfo.isRegularOwner || userInfo.isSuperUser;
        //     userInfo.canDeleteEvent =  userInfo.isSuperOwner;
        //     userInfo.canDeleteTicket =  userInfo.isSuperOwner;
        // user.firstname = authUser.user.firstName;
        // user.lastname = authUser.user.lastName;
        // user.email = authUser.user.userEmail;
        // user.role = authUser.user.userRole;
        // user.accountType = authUser.user.userStatus;
        // user.token = authUser.token;


        user = (new UserClass(authUser) as unknown) as AppUser;
    }

    return user;
}

export const User = userInfo();