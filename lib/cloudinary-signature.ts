// import { APPCONFIG } from "./app-config";
import { SHA256 } from "crypto-js";

const signUpload = (signableParams: Record<string, any>, apiSecret: string) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    signableParams = { ...signableParams, timestamp: timestamp }
    let sortedSignableParams: Record<string, any> = {};
    const sortedParams = Object.keys(signableParams).sort();
    for (let key of sortedParams) {
        sortedSignableParams[key] = signableParams[key];
    }

    const signableStr = sortedParams.map(key => `${key}=${signableParams[key]}`).join('&') + apiSecret;
    const signature = SHA256(signableStr);

    return { sortedSignableParams, signature, timestamp }
}

export default signUpload;
