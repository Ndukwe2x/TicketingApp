import React, { useContext } from "react";

export const FormDataContext = React.createContext<FormDataContextType | undefined>(undefined);

export const useFormData = (): FormDataContextType | undefined => useContext(FormDataContext);
