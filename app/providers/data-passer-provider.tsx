import { DataPasserContext } from "@/hooks/useCustomContexts";
import { useState, ReactNode } from "react";

interface DataPasserProviderProps {
    data: Record<string, any>;
    children: ReactNode;
}

export const DataPasserProvider: React.FC<DataPasserProviderProps> = ({ data, children }) => {
    // const [value, setValue] = useState<Record<string, any>>(data);

    // const updateFormData = (newData: Record<string, any>) => {
    //     setFormData((prevData) => ({ ...prevData, ...newData }));
    // };

    return (
        <DataPasserContext.Provider value={{ data }}>
            {children}
        </DataPasserContext.Provider>
    );
};