const sessionTimeOut = (timeout: number) => {
    const date = new Date();
    date.setTime(date.getTime() + timeout * 60 * 1000);
    return date.getTime();
}
export const APPCONFIG = {
    title: 'Tickets',
    description: 'A ticketing system for managing events and tickets.',
    version: '0.0.1',
    cookieOptions: {
        maxAge: (new Date()).getTime() + 24 * 60,
        secure: false, // Set to true in production
        httpOnly: false, // Set true in production
        path: '/'
    },
    cloudinary: {
        cloudName: 'dtuznvywy',
        apiEndpoint: 'https://api.cloudinary.com/v1_1/{cloudName}/upload',
        uploadSettings: {
            upload_preset: 'lightup_ticketing_upload',
            // asset_folder: '',
            // use_asset_folder_as_public_id_prefix: true,
        }
    }
};
