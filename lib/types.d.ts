// type AppEvent = {
//     id: string;
//     title: string;
//     summary: string;
//     description: string;
//     date: Date;
//     location: string;
//     price: number;
//     image: string;
//     featured: boolean;
// };

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
    eventDate: string;
    totalTickets: number;
    ticketsSold: number;
    ticketCategories: TicketCategory[];
    ticketClosingDate: string;
    eventBanner: string;
    posters: string[];
    createdAt: string;
};

type ImageInfo = {
    url: string;
    public_id: string;
    _id?: string;
}

type SingleEvent = {
    featured: boolean;
    _id: string;
    title: string;
    eventDate: string;
    address: string;
    city: string;
    state: string;
    ticketCategories: TicketCategory[];
    ticketClosingDate: string;
    eventBanner: ImageInfo;
    posters: ImageInfo[];
    createdAt: string;
    __v?: number;
}

type TicketCategory = {
    name: string;
    price: number;
    qty: number;
    discount: number;
};

type Tickets = Ticket[];
// {
//     objectId: string;
//     eventRef: string;
//     name: string;
//     email: string;
//     phone: string;
//     dateOfPurchase: Date | string;
//     referenceNumber: string;
//     ticketCategory: string;
//     amountPaid: number;
//     numberOfTickets: number
// }

type DashboardUsers = {
    id: string;
    name: string;
    date: string;
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
    dateOfPurchase: string;
    dueDate: string;
    admitted: boolean;
};
type Ticket = {
    _id: string;
    eventRef: string;
    name: string;
    email: string;
    phone: string;
    dateOfPurchase: string; //"2024-03-01T10:43:30.521Z",
    ticketCategory: string;
    amountPaid: number;
    numberOfTickets: number;
    referenceNo: number;
    __v: 0;
    event_title?: string;
    event?: SingleEvent | null;
}
interface TicketProps {
    _id: string;
    eventRef: string;
    name: string;
    email: string;
    phone: string;
    dateOfPurchase: string; //"2024-03-01T10:43:30.521Z",
    ticketCategory: string;
    amountPaid: number;
    numberOfTickets: number;
    referenceNo: number;
    __v: 0;
    event_title?: string;
}

interface TicketColumnDefProps extends TicketProps {
    event: SingleEvent | null;
}

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


type UserInfo = {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    accountType: string;
    eventRef: string[];
    userStatus: string;
    userRole: string;
    avatar: string;
    createdAt: Date | string;
    token: string;
    role?: string;
}

type AuthInfo = {
    user: {
        userEmail: string;
        firstName: string;
        lastName: string;
        userRole: string;
        userStatus: string;
    };
    token: string;
    // isOwner: boolean;
    // isSuper: boolean;
    // isRegular: boolean;
    // isBasic: boolean;
    // isSuperOwner: boolean;
    // isRegularOwner: boolean;
    // isBasicOwner: boolean;
    // isUser: boolean;
    // isSuperUser: boolean;
    // isRegularUser: boolean;
    // isBasicUser: boolean;
    // canCreateUser: boolean;
    // canUpdateUser: boolean;
    // canDeleteUser: boolean;
    // canCreateEvent: boolean;
    // canUpdateEvent: boolean;
    // canDeleteEvent: boolean;
    // canDeleteTicket: boolean;
}

type NewlyCreatedUserAccountData = {
    userId: string;
    status: string
}

type Callback = (param: Any, ...rest: any[]) => void;

interface CloudinaryUploadResponseData {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: string;
    height: string;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string;
    bytes: string;
    type: string;
    etag: string;
    placeholder: string;
    url: string;
    secure_url: string;
    folder: string;
    access_mode: string;
    original_filename: string;
    api_key?: string;
}

interface AppUser {
    rawData: Readonly<Record<string, any> | UserInfo>;
    id: string;
    firstname: string;
    lastname: string;
    fullName: string;
    email: string;
    phone: string;
    accountType: string;
    eventRef: string[];
    role: string;
    avatar: string;
    token: string | null;
    createdAt: string;
    isSuper: boolean;
    isRegular: boolean;
    isBasic: boolean;
    isOwner: boolean;
    isSuperOwner: boolean;
    isRegularOwner: boolean;
    isBasicOwner: boolean;
    isUser: boolean;
    isSuperUser: boolean;
    isRegularUser: boolean;
    isBasicUser: boolean;
    canCreateUser: boolean;
    canUpdateUser: boolean;
    canDeleteUser: boolean;
    canCreateEvent: boolean;
    canUpdateEvent: boolean;
    canDeleteEvent: boolean;
    canDeleteTicket: boolean;
    setProperty: (property: string, value: any) => void;
    getRawData: () => Record<string, any> | UserInfo
}

type GridColumnDef<TData> = {
    id: string | number;
    accessorKey: string;
    content: (column: TData) => React.ReactNode | string;
}

type GridColumn<TData> = {
    id: string | number;
    accessorKey: string;
    getContent: () => React.ReactNode | string;
};

type GridRow<TData> = {
    id: string | number;
    getColumns: () => Array<GridColumn<TData>>;
    getIsSelected: () => boolean;
};

type GridRows = Array<GridRow>;

type RowModel<TData> = {
    rows: Array<GridRow<TData>>;
}

type GridLayout<TData> = {
    data: TData[] | TData[][];
    // rows: GridRows<TData>;
    getRowModel: () => RowModel<TData>,
    getColumn: (columnId: number | string, rowId?: number | string) => GridColumn<TData> | null | undefined
}


type GridComponentOptions<TData> = {
    data: TData[] | TData[][] | {};
    columnDef: GridColumnDef<TData>;
    onSortingChange: React.Dispatch<React.SetStateAction<any>>;
    onColumnFiltersChange: React.Dispatch<React.SetStateAction<any>>;
    // getCoreRowModel: getCoreRowModel();
    // getPaginationRowModel: getPaginationRowModel();
    // getSortedRowModel: getSortedRowModel();
    // getFilteredRowModel: getFilteredRowModel();
    onColumnVisibilityChange: React.Dispatch<React.SetStateAction<any>>;
    onRowSelectionChange: React.Dispatch<React.SetStateAction<any>>;
    state: {},
}

interface TitleContextType {
    title: string | null;
    setTitle: (title: string) => void;
    isTitleEnabled: boolean;
    setIsTitleEnabled: (option: boolean) => void;
}

interface FormDataContextType {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

type TypeOfFormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type ViewType = 'list' | 'grid';

interface ToggleViewProps {
    dataSetId: string;
    setExternalViewType: React.Dispatch<React.SetStateAction<ViewType>>;
}