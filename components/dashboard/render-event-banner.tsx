import React, { ReactEventHandler, HTMLAttributes, ReactNode, useRef, useState } from "react";
import { useDeviceDetector } from "@/hooks/useMediaQuery";
import { ImageSkeleton } from "../ui/skeleton";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import * as NextImage from "next/image";
import { cn } from "@/lib/utils";
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";

const RenderEventBanner: React.FC<HTMLAttributes<HTMLImageElement> & { imgSrc: string, imgAltText: string }> = ({ className, imgSrc, imgAltText, ...props }) => {
    const actor = useAuthenticatedUser() as AppUser;
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    let output = useRef<ReactNode>(null);
    const mediaRef = useRef<HTMLImageElement>(null);
    const {
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop
    } = useDeviceDetector() as Record<string, boolean>;

    let mediaWidth: number = 240;
    if (isTablet) {
        mediaWidth = 342
    } else if (isDesktop) {
        mediaWidth = 297
    } else if (isLargeDesktop) {
        mediaWidth = 285
    }
    let mediaHeight: number = mediaWidth / 3 * 2 - 30;

    const handleImageLoad = () => {
        if (!mediaRef.current) return;
        const img = mediaRef.current;
        console.log(img);
        img?.classList.remove('hidden');
        setIsLoading(false);
    }

    const handleLoadError: ReactEventHandler<HTMLImageElement> = (ev) => {
        if (!mediaRef.current) return;
        const img = mediaRef.current;
        console.log(img);
        setIsLoading(false);
        setIsError(true);
    }

    return (
        <React.Fragment>
            {(isLoading || isError) && <ImageSkeleton className={className} width={mediaWidth} height={mediaHeight} />}
            <NextImage.default ref={mediaRef} src={imgSrc + `?t=${Date.now()}`}
                alt={imgAltText}
                width={mediaWidth} height={mediaHeight}
                layout="responsive"
                loading="eager"
                className={cn(className, isLoading ? 'hidden' : '')}
                onLoadingComplete={handleImageLoad}
                onError={handleLoadError}
                unoptimized={true}
                {...props} />
            {/* {isError && (
                <span className="absolute text-center top-1/2 flex flex-col items-center">
                    <MdSignalWifiConnectedNoInternet0 size={60} />
                    Unable to load image. Please check your connection and/or refresh the page.
                </span>
            )} */}
        </React.Fragment>
    )
}

export default RenderEventBanner;