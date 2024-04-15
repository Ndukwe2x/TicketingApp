"use client";

import * as CookiesNext from "cookies-next";
import { APPCONFIG } from "./app-config";

// This module provide the information of the logged in user as stored in the storage
// upon a successful authentication
export const User = (): AuthInfo => {
    // The JSON.stringify() and the dummy user data object passed to it must be replaced
    // with a real resource that returns a json string with the same structure.
    const cookieInfo: string|CookiesNext.CookieValueTypes|undefined = CookiesNext.getCookie('app_user', APPCONFIG.cookieOptions);
    //  || JSON.stringify({
    //     user: {
    //         id: 'm0f0nwe8r0anfapufpaf',
    //         firstName: 'Super',
    //         lastName: 'User',
    //         userEmail: 'superuser@ticket.com',
    //         accountType: 'owner',
    //         level: 'super'
    //     },
    //     token: 'mioaipanurowruawripa8r90w7t0598w5ssd YRLreSDFLAlkjlfjalflfllnflflsf'
    // });

    let userInfo = cookieInfo === undefined ? undefined : JSON.parse(cookieInfo);
    if (userInfo) {
        userInfo.isOwner = function () {
            return userInfo.user.userStatus === 'owner';
        }
    }

    return userInfo;
}
