import { APPCONFIG } from "./app-config";
import { SHA256 } from "crypto-js";

const signUpload = (uploadParams: {}, apiSecret: string) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    uploadParams = { ...uploadParams, timestamp: timestamp }
    let sortedUploadParams = {};
    const sortedParams = Object.keys(uploadParams).sort();
    for (let key of sortedParams) {
        sortedUploadParams[key] = uploadParams[key];
    }

    const signableStr = sortedParams.map(key => `${key}=${uploadParams[key]}`).join('&') + apiSecret;
    const signature = SHA256(signableStr);
    
    return { sortedUploadParams, signature }
}

export default signUpload;
