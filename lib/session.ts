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

    static isAuthenticated(): boolean {
        return hasCookie(this.cookieKey);
    }

    static authenticate(user: string | {}): void {
        user = typeof user !== 'string' ? JSON.stringify(user) : user;
        setCookie(this.cookieKey, user, cookieOptions as OptionsType);
        setCookie(this.authTimeCookieKey, (new Date()).toUTCString());
    }

    static getUser(): string | CookieValueTypes | undefined {
        return getCookie(this.cookieKey, cookieOptions as OptionsType);
    }

    static forgetUser(): void {
        deleteCookie(this.cookieKey, cookieOptions as OptionsType);
    }

    static logout(ev?: MouseEvent, sessionExpired?: boolean): void {
        if (ev && !ev?.defaultPrevented) {
            ev?.preventDefault();
        }
        this.forgetUser();
        deleteCookie(this.authTimeCookieKey, cookieOptions as OptionsType);
        let redirect = '/login?logged_out=1';
        if (sessionExpired) {
            redirect += '&session_expired=1&redir=' + location.pathname;
        }
        location.assign(redirect);
    }

    static async validateSession(actor: AppUser, pollIntervalInMinutes: number = 30): Promise<void> {

        const startTimeStr: string = getCookie(this.authTimeCookieKey, { ...cookieOptions, maxAge: undefined, expires: undefined }) as string;
        const now = new Date();
        const { minutes } = calculateTimeDifference(startTimeStr, now.toUTCString());
        // if ( !navigator.onLine ) {
        //     return;
        // }
        const validateToken = async (): Promise<boolean> => {
            const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', actor.id);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${actor.token}`,
                    }
                });
                if (response.status === 200) {
                    return true;
                }
                return false;
            } catch (error) {
                return false;
            }
        }

        /* Not properly logged in? Kick them out. */
        if (!startTimeStr) {
            this.logout(undefined);
        }

        /** At the specified interval, check if the token is still valid, and if not,
         * require them to login again.
         */
        if (minutes >= pollIntervalInMinutes) {
            const tokenValid = await validateToken();
            if (!tokenValid) {
                this.logout(undefined, true);
            }
        }
    }
};


