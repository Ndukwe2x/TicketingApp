export const APPCONFIG = {
    title: 'Tickets',
    description: 'A ticketing system for managing events and tickets.',
    version: '0.0.1',
    cloudinaryConfig: {
        cloudName: 'dtuznvywy',
        api: {
            upload: 'https://api.cloudinary.com/v1_1/dtuznvywy/upload',
            destroy: 'https://api.cloudinary.com/v1_1/dtuznvywy/image/destroy',
            key: '811318738171199',
            secret: 'ClD3mJxylKcIEek_dSdLcIOsKY8'
        },
        uploadSettings: {
            upload_preset: 'lightup_ticketing_upload',
            asset_folder: 'lightup-ticketing',
            use_asset_folder_as_public_id_prefix: true,
        }
    },
    accountTypes: ['owner','user'],
    userRoles: ['Super','Regular','Basic'],
    paginationOptions: {
        maxItemsPerPage: 10,
    }
};

export const sessionTimeOut = (timeout: number = 30) => {
    return new Date(Date.now() + timeout * 60 * 1000);
}

const cookieTime = sessionTimeOut(30);

export const cookieOptions = {
    maxAge: cookieTime,
    expires: cookieTime,
    secure: false, // Set to true in production
    httpOnly: false, // Set true in production
    path: '/'
};