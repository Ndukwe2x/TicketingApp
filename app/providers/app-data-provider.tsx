import { AppDataContext } from "@/hooks/useCustomContexts";
import { useReducer, ReactNode } from "react";

const initialState: AppDataState = {
    globalDataBag: {},
    pageDataBag: {},
};

type Action =
    | { type: 'SET_GLOBAL_DATA'; payload: Record<string, any> }
    | { type: 'SET_PAGE_DATA'; page: string; payload: Record<string, any> };

const reducer = (state: AppDataState, action: Action) => {
    switch (action.type) {
        case 'SET_GLOBAL_DATA':
            return { ...state, globalDataBag: { ...state.globalDataBag, ...action.payload } };
        case 'SET_PAGE_DATA': return { ...state, pageDataBag: { ...state.pageDataBag, [action.page]: action.payload } };
        default:
            return state;
    }
};

interface AppDataProviderProps {
    children: ReactNode;
}

const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const setGlobalData = (data: Record<string, any>) => {
        dispatch({ type: 'SET_GLOBAL_DATA', payload: data });
    };
    const setPageData = (page: string, data: Record<string, any>) => {
        dispatch({ type: 'SET_PAGE_DATA', page, payload: data });
    };

    return (
        <AppDataContext.Provider value={{ ...state, setGlobalData, setPageData }}>
            {children}
        </AppDataContext.Provider>
    );
};

export default AppDataProvider;