import React from "react";
import { TitleContext } from "@/hooks/useTitleContext";
import { useState } from "react";

interface TitleProviderProps extends React.HTMLAttributes<HTMLElement> {}

export default function TitleProvider ({ children }: TitleProviderProps) {
    const [title, setTitle] = useState(null);

    return (
        <TitleContext.Provider value={{title, setTitle}}>
            {children}
        </TitleContext.Provider>
    );
}
