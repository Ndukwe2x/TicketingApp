import React, { useContext } from "react";

export const FormDataContext = React.createContext<Partial<FormDataContextType>>({});

export const useFormData = (): Partial<FormDataContextType> => useContext(FormDataContext);
