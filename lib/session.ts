"use client";

import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { CookieValueTypes, OptionsType } from "cookies-next/lib/types";
import { APPCONFIG, cookieOptions } from "./app-config";
import axios from "axios";
import { Api } from "./api";
import React from "react";
import { calculateTimeDifference } from "./utils";

export class Session {
    static cookieKey = 'app_user';
    static authTimeCookieKey = 'app_start_time';

    static isAuthenticated (): boolean {
        return hasCookie(this.cookieKey);
    }

    static authenticate (user: string | {}): void {
        user = typeof user !== 'string' ? JSON.stringify(user) : user;
        setCookie(this.cookieKey, user, cookieOptions as OptionsType);
        setCookie(this.authTimeCookieKey, (new Date()).toUTCString());
    }

    static getUser (): string | CookieValueTypes | undefined {
        return getCookie(this.cookieKey, cookieOptions as OptionsType);
    }

    static forgetUser (): void {
        deleteCookie(this.cookieKey, cookieOptions as OptionsType);
    }

    static logout (ev?: MouseEvent, sessionExpired?: boolean): void {
        if ( ev && !ev?.defaultPrevented ) {
            ev?.preventDefault();
        }
        this.forgetUser();

        let redirect = '/login?logged_out=1';
        if ( sessionExpired ) {
            redirect += '&session_expired=1&redir=' + location.pathname;
        }
        location.assign(redirect);
    }

    static validateSession (): void {
        // const url = Api.server + Api.endpoints.admin.register;
        const startTimeStr: string = getCookie(this.authTimeCookieKey, {...cookieOptions, maxAge: undefined, expires: undefined}) as string;
        const now = new Date();
        const { seconds, minutes, hours, days } = calculateTimeDifference(startTimeStr, now.toUTCString());

        if ( hours >= 22 ) {
            this.logout(undefined, true);
        }

        // try {
        //     const response = await axios.postForm(url, {foo: 'bar'}, {
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         }
        //     });
        // } catch (error) {
        //     if ( !error.response || !error.response.status ) {
        //         return;
        //     }
        //     if (error.response.status == 401) {
        //         this.logout(undefined, true);
        //     }
        // }
    }
};

