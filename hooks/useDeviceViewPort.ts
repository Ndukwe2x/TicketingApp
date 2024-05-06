"use client";

import { useEffect, useState } from "react";

type ViewPortDataType = {
    deviceWidth: number | undefined; 
    deviceHeight: number | undefined;
} | undefined;

const useDeviceViewPort = (): ViewPortDataType => {
    const [viewPort, setViewPort] = useState<ViewPortDataType>(undefined);

    useEffect(() => {
        const handleResize = () => {
            setViewPort({deviceWidth: window.innerWidth, deviceHeight: window.innerHeight});
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return viewPort;
}

export default useDeviceViewPort;