import * as React from 'react';

export function useMediaQuery(query: string) {
    const [value, setValue] = React.useState(false);

    React.useEffect(() => {
        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches);
        }

        const result = matchMedia(query);
        result.addEventListener('change', onChange);
        setValue(result.matches);

        return () => result.removeEventListener('change', onChange);
    }, [query]);

    return value;
}

export function useDeviceDetector(target?: string, invalidateIfUnrecognized: boolean = false) {
    const devices = {
        isMobile: useMediaQuery('(min-width:320px)'),
        isTablet: useMediaQuery('(min-width:768px)'),
        isDesktop: useMediaQuery('(min-width:1024px)'),
        isLargeDesktop: useMediaQuery('(min-width:1200px)')
    }

    if (target) {
        switch (target) {
            case 'mobile':
                return devices.isMobile;
            case 'tablet':
                return devices.isTablet;
            case 'desktop':
                return devices.isDesktop;
            case 'large':
                return devices.isLargeDesktop;
            default:
                if (invalidateIfUnrecognized) {
                    throw new TypeError(`Unrecognized device type: "${target}"`)
                }
                return false;
        }
    }

    return devices
}