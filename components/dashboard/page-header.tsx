import NavigateBack from "@/components/dashboard/navigate-back";
import { Heading } from "@/components/ui/headers";
import { useTitle } from "@/hooks/useTitleContext";
import { cn } from "@/lib/utils";
import { capitalCase } from "change-case";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
}

export default function PageHeader({ children, className, ...props }: PageHeaderProps) {
    const { title, setTitle, isTitleEnabled } = useTitle() as TitleContextType;
    const path = usePathname();
    const titleRef = useRef<string | null>(null);
    const [pageTitle, setPageTitle] = useState<string | null>(null);

    useEffect(() => {
        // if (!title || !titleRef || !path) {
        //     return;
        // }
        const route = path.slice(path.length > 1 ? 1 : path.length - 1);
        const routeArr = route.split('/');
        let page = routeArr[0] || 'dashboard';

        // if title is null or empty, that means this page has no title defined.
        // So we use the route
        if ([null, ''].includes(title)) {
            titleRef.current = page;
            setPageTitle(page);
        } else if (
            ![titleRef.current, page, pageTitle].includes(title?.toLocaleLowerCase() as string) &&
            page.indexOf(title?.toLocaleLowerCase() as string) < 0
        ) {
            setPageTitle(title);
            titleRef.current = (title?.toLocaleLowerCase() as string);
        }
    }, [title, path, titleRef, , pageTitle]);

    return (
        <div className={cn('flex items-center mb-4 gap-3', className)} {...props}>
            <NavigateBack />
            {isTitleEnabled && pageTitle && <Heading variant='h1' className='page-title responsive-title'>{capitalCase(pageTitle)}</Heading>}
        </div>
    )
}
