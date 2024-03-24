import * as CookiesNext from "cookies-next";

export class Session {
    static isAuthenticated (): boolean {
        // return <boolean>CookiesNext.hasCookie('sessionId')
        return <boolean> (localStorage.getItem('user') !== null);
    }

    static authenticate (user: string): void {
        CookiesNext.setCookie('user', JSON.stringify(user), {maxAge: (60 * 24)});
    }


};
