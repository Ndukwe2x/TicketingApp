import { useContext } from "react";
import { createContext } from "react";

interface FormContextProps {
    formData: Record<string, any>;
    updateFormData: (newData: Record<string, any>) => void;
}

export const FormContext = createContext<FormContextProps | undefined>(undefined);
export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
}

/**
 * Events and User Form Data context.
 * Can also be used in other form use cases.
 */
const defaultEventData = {
    formData: {}
}
export const EventFormDataContext = createContext<EventFormDataContextType>(defaultEventData);
export const useEventFormData = (): EventFormDataContextType => {
    const context = useContext(EventFormDataContext);
    if (!context) {
        throw new Error('useEventFormData must be used within the EventFormDataProvider');
    }
    return context;
}


/**
 * Data passer context
 */
interface DataPasserContextProps {
    data: Record<string, any>;
}

export const DataPasserContext = createContext<DataPasserContextProps | undefined>(undefined);
export const useDataPasserContext = () => {
    const context = useContext(DataPasserContext);
    if (!context) {
        throw new Error('useDataPasserContext must be used within a DataPasserProvider');
    }
    return context;
}
