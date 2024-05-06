"use client";

import * as CookiesNext from "cookies-next";
import { APPCONFIG } from "./app-config";

// This module provide the information of the logged in user as stored in the storage
// upon a successful authentication
const UserInfo = (): AuthInfo => {
    // The JSON.stringify() and the dummy user data object passed to it must be replaced
    // with a real resource that returns a json string with the same structure.
    const cookieInfo: string|CookiesNext.CookieValueTypes|undefined = CookiesNext.getCookie('app_user', APPCONFIG.cookieOptions);
    //  || JSON.stringify({
    //     user: {
    //         // firstName: 'Super',
    //         // lastName: 'User',
    //         userEmail: 'johnywise@gmail.com',
    //         userStatus: 'owner',
    //         userRole: 'super'
    //     },
    //     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWUwYmM5MjdiOTMzNTlhZWUwYzkwN2EiLCJlbWFpbCI6ImpvaG55d2lzZUBnbWFpbC5jb20iLCJpYXQiOjE3MTE2NDQ1OTQsImV4cCI6MTcxMTczMDk5NH0.EY9ITmsyoq59aPiuReFkKXFYqquc4HzFoT-nE9lDdnk'
    // });

    let userInfo = cookieInfo === undefined ? undefined : JSON.parse(cookieInfo);
    if (userInfo) {
        userInfo.isSuper =  userInfo.user.userRole === 'Super';
        userInfo.isRegular =  userInfo.user.userRole === 'Regular';
        userInfo.isBasic =  userInfo.user.userRole === 'Basic';
        userInfo.isOwner =  userInfo.user.userStatus === 'owner';
        userInfo.isSuperOwner =  userInfo.isOwner && userInfo.isSuper;
        userInfo.isRegularOwner =  userInfo.isOwner && userInfo.isRegular;
        userInfo.isBasicOwner =  userInfo.isOwner && userInfo.isBasic;
        userInfo.isUser =  userInfo.user.userStatus === 'user';
        userInfo.isSuperUser =  userInfo.isUser && userInfo.isSuper;
        userInfo.isRegularUser =  userInfo.isUser && userInfo.isRegular;
        userInfo.isBasicUser =  userInfo.isUser && userInfo.isBasic;
        userInfo.canCreateUser =  userInfo.isSuperOwner || userInfo.isSuperUser;
        userInfo.canUpdateUser =  userInfo.isSuperOwner || userInfo.isRegularOwner || userInfo.isSuperUser
        userInfo.canDeleteUser =  userInfo.isSuperOwner || userInfo.isRegularOwner || userInfo.isSuperUser;
        userInfo.canCreateEvent =  userInfo.isSuperOwner || userInfo.isSuperUser;
        userInfo.canUpdateEvent =  userInfo.isSuperOwner || userInfo.isRegularOwner || userInfo.isSuperUser;
        userInfo.canDeleteEvent =  userInfo.isSuperOwner;
        userInfo.canDeleteTicket =  userInfo.isSuperOwner;
    }

    return userInfo;
}

export const User = UserInfo();