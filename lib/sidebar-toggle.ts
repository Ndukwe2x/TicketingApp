export const ToggleSidebar = () => {
    const sidebar = document.body.querySelector('#dashboard-navigation');
    const expanded = 'expanded';
    const collapsed = 'collapsed';
    if (sidebar?.classList.contains(expanded)) {
        sidebar?.classList.remove(expanded);
        sidebar?.classList.add(collapsed);
    } else {
        sidebar?.classList.add(expanded);
        sidebar?.classList.remove(collapsed);
    }
    
}