import { useDeviceDetector } from "@/hooks/useMediaQuery";
import { ImageSkeleton } from "../ui/skeleton";
import { HTMLAttributes, memo, ReactNode } from "react";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { useGetEventById } from "@/hooks/useGetEvents";
import Image from "next/image";
import { isAxiosError } from "axios";

const RenderEventBanner: React.FC<HTMLAttributes<HTMLImageElement> & { eventId: string }> = ({ className, eventId, ...props }) => {
    const actor = useAuthenticatedUser() as AppUser;
    const [isLoading, event, error] = useGetEventById(eventId, actor);
    let output: ReactNode = null;
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
    if (isLoading) {
        output = <ImageSkeleton className={className} width={mediaWidth} height={mediaHeight} />;
    } else if (event !== null) {
        output = (
            <Image src={event.eventBanner.url} alt={event.title}
                width={mediaWidth} height={mediaHeight}
                className={className} {...props} />
        )
    } else {
        if (isAxiosError(error)) {

        }
    }
    return output;
}

export default memo(RenderEventBanner);