import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";

interface NetworkErrorProps extends React.HTMLAttributes<HTMLDivElement> {
    showRefreshButton?: boolean;
}
const NoNetwork: React.FC<NetworkErrorProps> = ({ children, className, showRefreshButton = true, ...props }) => {
    const router = useRouter();
    return (
        <div className={cn('flex flex-col gap-2 items-center justify-center responsive-text-2 text-muted-foreground ' + (className || ''))} {...props}>
            <MdSignalWifiConnectedNoInternet0 size={85} />
            <div>
                {children || <p className="text-center">Sorry, it appears you are offline. <br />Please check your internet connection and refresh the page.</p>}
            </div>
            {
                showRefreshButton && <Button type="button" onClick={() => { location.reload() }}>Refresh</Button>
            }
        </div>
    )
}

export default NoNetwork;