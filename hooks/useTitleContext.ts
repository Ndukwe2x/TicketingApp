import React, { Dispatch, SetStateAction, useContext } from "react";

export const TitleContext = React.createContext<TitleContextType>({
    title: null,
    setTitle: (title: string) => { },
    isTitleEnabled: true,
    setIsTitleEnabled: (option: boolean) => { }
});
export const useTitle = (): TitleContextType => useContext(TitleContext);

// export const TitleContext = React.createContext<React.MutableRefObject<string | null> | null>(null);
// export const useTitle = (): React.MutableRefObject<string | null> | null => useContext(TitleContext);
