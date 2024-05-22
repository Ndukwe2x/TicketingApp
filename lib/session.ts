"use client";

import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { CookieValueTypes, OptionsType } from "cookies-next/lib/types";
import { cookieOptions } from "./app-config";
import axios from "axios";
import { Api } from "./api";
import React from "react";

export class Session {
    static cookieKey = 'app_user';

    static isAuthenticated (): boolean {
        return hasCookie(this.cookieKey);
    }

    static authenticate (user: string | {}): void {
        user = typeof user !== 'string' ? JSON.stringify(user) : user;
        setCookie(this.cookieKey, user, cookieOptions as OptionsType);
    }

    static getUser (): string | CookieValueTypes | undefined {
        return getCookie(this.cookieKey, cookieOptions as OptionsType);
    }

    static forgetUser (): void {
        deleteCookie(this.cookieKey, cookieOptions as OptionsType);
    }

    static logout (ev?: Event | unknown, sessionExpired?: boolean): void {
        if ( ev && !ev?.defaultPrevented ) {
            ev?.preventDefault();
        }
        this.forgetUser();

        let redirect = '/login?logged_out=1';
        if ( sessionExpired ) {
            redirect += '&redir=' + location.pathname;
        }
        location.assign(redirect);
    }

    static async validateSession (token: string): Promise<void> {

        const url = Api.server + Api.endpoints.admin.register;

        try {
            const response = await axios.postForm(url, {foo: 'bar'}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        } catch (error) {
            if ( !error.response || !error.response.status ) {
                return;
            }
            if (error.response.status == 401) {
                this.logout(undefined, true);
            }
        }
    }
};

