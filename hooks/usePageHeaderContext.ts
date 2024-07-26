import React, { Dispatch, ReactNode, SetStateAction, useContext } from "react";

export const PageHeaderContext = React.createContext<PageHeaderContextType>({
    pageTitle: null,
    setPageTitle: (title: string | null | undefined) => { },
    isPageTitleEnabled: true,
    setIsPageTitleEnabled: (option: boolean) => { },
    widget: null,
    setWidget: (widget: ReactNode) => { }
});
export const usePageHeader = (): PageHeaderContextType => useContext(PageHeaderContext);

// export const TitleContext = React.createContext<React.MutableRefObject<string | null> | null>(null);
// export const useTitle = (): React.MutableRefObject<string | null> | null => useContext(TitleContext);
