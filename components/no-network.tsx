import { cn } from "@/lib/utils";
import React from "react";
import { MdNetworkWifi, MdOfflineBolt, MdOfflinePin, MdSignalWifiConnectedNoInternet0 } from "react-icons/md";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface NetworkErrorProps extends React.HTMLAttributes<HTMLDivElement> {
    showRefreshButton?: boolean;
}
const NoNetwork: React.FC<NetworkErrorProps> = ({children, className, showRefreshButton = true, ...props}) => {
    const router = useRouter();
    return (
        <div className={ cn('flex flex-col gap-2 items-center justify-center text-auto-scale text-muted-foreground ' + (className || '')) } {...props}>
            <MdSignalWifiConnectedNoInternet0 size={85} />
            <div>
                { children || 'Sorry, it appears you are offline. Please reconnect and refresh the page.' }
            </div>
            {
                showRefreshButton && <Button type="button" onClick={ () => location.reload() }>Refresh</Button>
            }
        </div>
    )
}

export default NoNetwork;