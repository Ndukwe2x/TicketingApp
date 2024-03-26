export const Api = {
    server: 'https://ticketing-app-api-5f23135e89f2.herokuapp.com/api/v1',
    endpoints: {
        public: {
            events: '/events',
            search: '/events/search',
            singleEvent: '/events/:id',
            tickets: '/tickets',
            ticket: '/tickets/:id'
        },
        admin: {
            login: '/login',
            register: '/admin',
            search: '/admin/accounts/search',
            singleUser: '/admin/accounts/:id',
            events: '/admin/events',
            event: '/admin/events/:id',
            tickets: '/admin/tickets',
            searchTickets: '/admin/tickets/search',
            singleTicket: '/admin/tickets/:id',
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