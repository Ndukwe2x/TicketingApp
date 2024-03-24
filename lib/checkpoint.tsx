
export const checkAuth = () => {
    if ( typeof window != 'undefined' && window.localStorage ) {
        if ( localStorage.getItem('sessionId') ) {
            return location.assign('/dashboard');
        } else if ( ! location.pathname.search( /login/ ) ) {
            return location.assign( '/login' );
        }
    } else {
        // Alternative 
    }
}