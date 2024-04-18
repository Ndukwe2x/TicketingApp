"use client";

import * as CookiesNext from "cookies-next";
import { APPCONFIG } from "./app-config";

// This module provide the information of the logged in user as stored in the storage
// upon a successful authentication
export const User = (): AuthInfo => {
    // The JSON.stringify() and the dummy user data object passed to it must be replaced
    // with a real resource that returns a json string with the same structure.
    const cookieInfo: string|CookiesNext.CookieValueTypes|undefined = CookiesNext.getCookie('app_user', APPCONFIG.cookieOptions)
     || JSON.stringify({
        user: {
            // firstName: 'Super',
            // lastName: 'User',
            userEmail: 'johnywise@gmail.com',
            userStatus: 'owner',
            userRole: 'super'
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWUwYmM5MjdiOTMzNTlhZWUwYzkwN2EiLCJlbWFpbCI6ImpvaG55d2lzZUBnbWFpbC5jb20iLCJpYXQiOjE3MTE2NDQ1OTQsImV4cCI6MTcxMTczMDk5NH0.EY9ITmsyoq59aPiuReFkKXFYqquc4HzFoT-nE9lDdnk'
    });

    let userInfo = cookieInfo === undefined ? undefined : JSON.parse(cookieInfo);
    if (userInfo) {
        userInfo.isOwner = function () {
            return userInfo.user.userStatus === 'owner';
        }
    }

    return userInfo;
}
