export const dummyEvent: DashboardEvent = {
    objectId: '1',
    title: 'Summer Music Festival',
    organizers: ['Music Events Inc.'],
    sponsors: ['LocalRadio Station', 'City Tourism Board'],
    address: '123 Festival Street',
    city: 'Sunshine City',
    state: 'California',
    eventDate: new Date('2024-07-15T18:30:00'),
    totalTickets: 1000,
    ticketsSold: 300,
    ticketCategories: [
        { name: 'General Admission', price: 25.99, qty: 500, discount: 0 },
        { name: 'VIP Pass', price: 499.99, qty: 300, discount: 10 },
        { name: 'Backstage Access', price: 899.99, qty: 200, discount: 15 },
    ],
    ticketClosingDate: new Date('2024-07-10T23:59:59'),
    eventBanner: '/showcase.jpg',
    posters: ['poster1.jpg', 'poster2.jpg', 'poster3.jpg'],
    createdAt: new Date(),
};


export const dummyDashboardAttendees: DashboardAttendees[] = [];
    /*[
    {
        id: 'm5gr84i9',
        title: 'event title',
        organizers: ['Uber', 'PHCity'],
        sponsors: [],
        venue: 'some venue',
        date: new Date(),
        totalTickets: 30,
        ticketsSold: 24,
    },
];*/
export const dummySummary = {
    totalAttendees: {
        value: 3291,
        label: 'Last 30 days',
        percentage: 12,
    },
    totalOrders: {
        value: 291,
        label: 'Last 30 days',
        percentage: 4,
    },
    totalRevenue: {
        value: 852091,
        label: 'Last 30 days',
        percentage: 8,
    },
    totalEvents: {
        value: 63,
        label: 'Last 30 days',
        percentage: 3,
    },
};
export const dummyEvents = [
    {
        id: '1',
        title: 'Art Exhibition',
        summary:
            'Explore a diverse collection of artworks from talented local and international artists. Immerse yourself in a world of creativity and expression.',
        description:
            'The Art Exhibition showcases a wide range of artistic styles, including paintings, sculptures, and multimedia installations. Experience the power of visual storytelling and discover the unique perspectives of each artist. Join us for an evening of cultural enrichment and appreciation for the arts. Whether you are an art enthusiast or a casual observer, this event promises to captivate your imagination and leave a lasting impression.',
        date: new Date('2024-03-15T18:00:00'),
        location: 'City Art Gallery, 123 Main Street, Anytown',
        price: 1000,
        image: '/events/art_exhibition.jpg',
        featured: true,
    },
];
export const dummyDashboardEvents: DashboardEvent[] = []

// export const Api = {
//     server: 'https://ticketing-app-api-5f23135e89f2.herokuapp.com/api/v1',
//     endpoints: {
//         public: {
//             events: '/events',
//             search: '/events/search',
//             singleEvent: '/events/:id',
//             tickets: '/tickets',
//             ticket: '/tickets/:id'
//         },
//         admin: {
//             auth: '/login',
//             createAccount: '/admin',
//             search: '/admin/accounts/search',
//             singleUser: '/admin/accounts/:id',
//             events: '/admin/events',
//             event: '/admin/events/:id',
//             tickets: '/admin/tickets',
//             searchTickets: '/admin/tickets/search',
//             singleTicket: '/admin/tickets/:id',
//         }
//     }
// }