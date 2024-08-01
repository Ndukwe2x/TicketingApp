import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FaChevronLeft } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NavigateBack: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
    const router = useRouter();
    const route = usePathname();
    const [refererUrl, setRefererUrl] = useState<string>('');

    useEffect(() => {
        if (document.referrer) {
            setRefererUrl(document.referrer);
        }
        return () => { };
    }, []);

    const backward = () => {
        const refererPath = refererUrl.split('?').shift();
        if (route === '/' || refererPath === '/login') return;
        router.back();
    }

    return (
        <div className={cn('mr-2', className)}>
            <Button variant='outline' type="button" onClick={backward} className="flex items-center gap-2 py-2 px-2 h-auto">
                <FaChevronLeft size={14} /> Back
            </Button>
        </div>
    )
}

export default NavigateBack;