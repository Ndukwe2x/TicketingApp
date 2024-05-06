export const Api = {
    server: 'https://ticketing-app-api-5f23135e89f2.herokuapp.com',
    endpoints: {
        public: {
            events: '/api/v1/events',
            search: '/api/v1/events/search',
            singleEvent: '/api/v1/events/:id',
            tickets: '/api/v1/tickets',
            ticket: '/api/v1/tickets/:id'
        },
        admin: {
            login: '/api/v1/login',
            register: '/api/v1/admin',
            search: '/api/v1/admin/accounts/search',
            singleUser: '/api/v1/admin/accounts/:id',
            events: '/api/v1/admin/events',
            event: '/api/v1/admin/events/:id',
            tickets: '/api/v1/admin/tickets',
            searchTickets: '/api/v1/admin/tickets/search',
            singleTicket: '/api/v1/admin/tickets/:id',
        }
    }
}

export const HttpRequest = async (
    url: string, 
    method: string = "GET", 
    data?: object, 
    contentType?: string
) => {
    const options: RequestInit = {
        method: method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": contentType ?? "application/json",
        },
        redirect: "follow",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: (data ? JSON.stringify(data) : null)
    }


    const response: Response = await fetch(url, options);

    return response;
};