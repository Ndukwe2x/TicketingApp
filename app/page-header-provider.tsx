import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { PageHeaderContext } from "@/hooks/usePageHeaderContext";
import { useState } from "react";

interface PageHeaderProviderProps extends React.HTMLAttributes<HTMLElement> { }

export default function PageHeaderProvider({ children }: PageHeaderProviderProps) {
    const titleRef = useRef<string | null>(null);
    const [pageTitle, setPageTitle] = useState<string | null>();
    const [isPageTitleEnabled, setIsPageTitleEnabled] = useState(true);
    const [widget, setWidget] = useState<ReactNode>();

    return (
        <PageHeaderContext.Provider value={{
            pageTitle,
            setPageTitle,
            isPageTitleEnabled,
            setIsPageTitleEnabled,
            widget,
            setWidget
        }}>
            {children}
        </PageHeaderContext.Provider>
    );
}
