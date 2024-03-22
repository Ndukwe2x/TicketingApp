type AppEvent = {
    id: string;
    title: string;
    summary: string;
    description: string;
    date: Date;
    location: string;
    price: number;
    image: string;
    featured: boolean;
};

type DashboardEvent = {
    objectId: string;
    title: string;
    // organizers: string[];
    // sponsors: string[];
    address: string;
    city: string;
    state: string;
    country: string;
    featured: boolean;
    eventDate: Date;
    totalTickets: number;
    ticketsSold: number;
    ticketCategories: TicketCategory[];
    ticketClosingDate: Date | string;
    eventBanner: string;
    posters: string[];
    createdAt: Date;
};

type TicketCategory = {
    name: string;
    price: number;
    qty: number;
    discount: number;
};

type Tickets = {
    objectId: string;
    eventRef: string;
    name: string;
    email: string;
    phone: string;
    dateOfPurchase: Date | string;
    referenceNumber: string;
    ticketCategory: string;
    amountPaid: number;
    numberOfTickets: number
}

type DashboardAttendees = {
    id: string;
    name: string;
    date: Date | string;
    totalEvents: number;
    status: 'active' | 'suspended' | 'banned';
};

type DashboardSales = {
    objectId: string;
    eventRef: string;
    referenceNumber: string;
    name: string;
    email: string;
    phone: string;
    ticketCategory: string;
    numberOfTickets: number;
    amountPaid: number;
    dateOfPurchase: Date | string;
    dueDate: Date | string;
    admitted: boolean;
};

type DashboardSummaryItem = {
    value: number;
    label: string;
    percentage: number;
};
type DashboardSummaryEntry = 'totalAttendees' | 'totalOrders' | 'totalRevenue' | 'totalEvents';
type DashboardSummary = {
    [key in DashboardSummaryEntry]: DashboardSummaryItem;
};

type FetchApiOptions = {
    method: string;
    mode: string;
    cache: string;
    credentials: string;
    headers: object;
    redirect: string;
    referrerPolicy: string;
}