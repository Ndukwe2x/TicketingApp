type UserType = UserInfo & AuthInfo;

export default class UserClass implements AppUser {
    protected rawData: Record<string, any> | UserInfo;
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

    constructor(userInfo: UserInfo) {
        this.rawData = userInfo;
        for (const [key, value] of Object.entries(userInfo)) {
            this.setProperty(key, value);
        }

        this.isSuper = [userInfo?.userRole, userInfo?.role].includes('Super');
        this.isRegular = [userInfo?.userRole, userInfo?.role].includes('Regular');
        this.isBasic = [userInfo?.userRole, userInfo?.role].includes('Basic');
        this.isOwner = [userInfo?.userStatus, userInfo?.accountType].includes('owner');
        this.isSuperOwner = this.isOwner && this.isSuper;
        this.isRegularOwner = this.isOwner && this.isRegular;
        this.isBasicOwner = this.isOwner && this.isBasic;
        this.isUser = [userInfo?.userStatus, userInfo?.accountType].includes('user');
        this.isSuperUser = this.isUser && this.isSuper;
        this.isRegularUser = this.isUser && this.isRegular;
        this.isBasicUser = this.isUser && this.isBasic;
        this.canCreateUser = this.isSuperOwner || this.isSuperUser;
        this.canUpdateUser = this.isSuperOwner || this.isRegularOwner || this.isSuperUser
        this.canDeleteUser = this.isSuperOwner || this.isRegularOwner || this.isSuperUser;
        this.canCreateEvent = this.isSuperOwner || this.isSuperUser;
        this.canUpdateEvent = this.isSuperOwner || this.isRegularOwner || this.isSuperUser;
        this.canDeleteEvent = this.isSuperOwner;
        this.canDeleteTicket = this.isSuperOwner;

        this.setProperty('fullName', this.firstname + ' ' + this.lastname);
    }

    setProperty(prop: string, value: any) {
        Object.defineProperty(this, prop, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: value,
        });
    }

    getRawData(): Record<string, any> | UserInfo {
        return this.rawData;
    }
}

