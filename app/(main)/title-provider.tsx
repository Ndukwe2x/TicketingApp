import React from "react";
import { TitleContext } from "@/hooks/useTitleContext";
import { useState } from "react";

interface TitleProviderProps extends React.HTMLAttributes<HTMLElement> { }

export default function TitleProvider({ children }: TitleProviderProps) {
    const [title, setTitle] = useState<string | null>('');
    const [isTitleEnabled, setIsTitleEnabled] = useState(true);

    return (
        <TitleContext.Provider value={{ title, setTitle, isTitleEnabled, setIsTitleEnabled }}>
            {children}
        </TitleContext.Provider>
    );
}
