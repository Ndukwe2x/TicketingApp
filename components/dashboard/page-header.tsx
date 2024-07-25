import NavigateBack from "@/components/dashboard/navigate-back";
import { Heading } from "@/components/ui/headers";
import { usePageHeader } from "@/hooks/usePageHeaderContext";
import { PageHeaderContextType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { capitalCase } from "change-case";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
}

export default function PageHeader({ children, className, ...props }: PageHeaderProps) {
    const { pageTitle, isPageTitleEnabled, setIsPageTitleEnabled, widget, setWidget } = usePageHeader() as PageHeaderContextType;
    const path = usePathname();
    const titleRef = useRef<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);

    useEffect(() => {
        // if (!title || !titleRef || !path) {
        //     return;
        // }
        const route = path.slice(path.length > 1 ? 1 : path.length - 1);
        const routeArr = route.split('/');
        let page = routeArr[0] || 'dashboard';
        setWidget(null);

        // if title is null or empty, that means this page has no title defined.
        // So we use the route
        if (pageTitle === undefined) {
            titleRef.current = page;
            setTitle(page);
            setIsPageTitleEnabled(true);
        } else if (pageTitle === null && titleRef.current !== page) {
            titleRef.current = page;
            setTitle(page);
            setIsPageTitleEnabled(true);
        } else if (
            ![titleRef.current, page].includes(pageTitle?.toLocaleLowerCase() as string) &&
            page.indexOf(pageTitle?.toLocaleLowerCase() as string) < 0
        ) {
            setTitle(pageTitle as string);
            titleRef.current = typeof pageTitle === 'string' ? (pageTitle?.toLocaleLowerCase() as string) : pageTitle;
            // setIsPageTitleEnabled(true);
        }
    }, [path, titleRef, , pageTitle, setIsPageTitleEnabled, setWidget]);

    return (
        <div className={cn('flex items-center mb-4 gap-3', className)} {...props}>
            <NavigateBack />
            {isPageTitleEnabled && (title) && <Heading variant='h1' className='page-title responsive-title'>{capitalCase(title)}</Heading>}
            {widget}
        </div>
    )
}
