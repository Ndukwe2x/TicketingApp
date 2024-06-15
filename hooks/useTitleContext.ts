import React, { Dispatch, SetStateAction, useContext } from "react";

export const TitleContext = React.createContext<TitleContextType | undefined>(undefined);
export const useTitle = (): TitleContextType | undefined => useContext(TitleContext);

// export const TitleContext = React.createContext<React.MutableRefObject<string | null> | null>(null);
// export const useTitle = (): React.MutableRefObject<string | null> | null => useContext(TitleContext);
