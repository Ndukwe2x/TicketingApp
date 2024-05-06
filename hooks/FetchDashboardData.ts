import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
// import { Api, HttpRequest } from "@/lib/api";


export async function fetchDashboardData (url: string, options?: AxiosRequestConfig) {
    const getResult = async () => {
        try {
            const response = await axios.get(url, options);
            
            return response.data();
        } catch (error) {
            return error;
        }
    }
    
    return await getResult();
}