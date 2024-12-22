import { FormContext } from "@/hooks/useCustomContexts";
import { useState, ReactNode } from "react";

interface FormProviderProps {
    children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});

    const updateFormData = (newData: Record<string, any>) => (
        setFormData((prevData) => ({ ...prevData, ...newData }))
    );

    return (
        <FormContext.Provider value={{ formData, updateFormData }}>
            {children}
        </FormContext.Provider>
    );
};