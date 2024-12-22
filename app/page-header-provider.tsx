import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { PageHeaderContext } from "@/hooks/usePageHeaderContext";
import { useState } from "react";

interface PageHeaderProviderProps extends React.HTMLAttributes<HTMLElement> { }

export default function PageHeaderProvider({ children }: PageHeaderProviderProps) {
    const titleRef = useRef<string | null>(null);
    const [pageTitle, setPageTitle] = useState<string | null | undefined>(undefined);
    const [isPageTitleEnabled, setIsPageTitleEnabled] = useState(false);
    const [docTitle, setDocTitle] = useState<string | null | undefined>(undefined);
    const [widget, setWidget] = useState<ReactNode | null>(null);

    return (
        <PageHeaderContext.Provider value={{
            pageTitle,
            setPageTitle,
            docTitle,
            setDocTitle,
            isPageTitleEnabled,
            setIsPageTitleEnabled,
            widget,
            setWidget
        }}>
            {children}
        </PageHeaderContext.Provider>
    );
}
