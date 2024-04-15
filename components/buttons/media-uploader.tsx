import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import styles from '../styles/styles.module.css';
import { APPCONFIG } from "@/lib/app-config";
import React, { ChangeEvent } from "react";
import axios from "axios";

// interface ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   asChild?: boolean
// }
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

interface UploaderProps {
    uploadSuccessHandler: (url: string) => void;
    assetFolder?: string|null;
}
const MediaUploader: React.FC<UploaderProps> = ({ uploadSuccessHandler, assetFolder}) => {
    const cloudName = APPCONFIG.cloudinary.cloudName;
    const cloudinary = APPCONFIG.cloudinary.apiEndpoint.replace('{cloudName}', cloudName);
    
    let uploadSettings: Object = APPCONFIG.cloudinary.uploadSettings;
    if ( assetFolder ) {
        uploadSettings = {...uploadSettings, asset_folder: assetFolder};
    }

    const uploadFile = (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        // Applying the cloudinary upload settings for the asset
        for (const [key, value] of Object.entries(uploadSettings)) {
            formData.append(key, value);
        }
        
        try {
            axios
                .post(cloudinary, formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    uploadSuccessHandler(response.data);
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        } catch (error) {
            
        }
    }
    const uploadSelectedFiles = async (ev: ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files; // Get the selected file
    
        if (!files?.length) {
          console.error('No file selected.');
          return;
        }
    
        // formData.append('tags', 'browser_upload');
        for (let i = 0; i < files.length; i++) {
            uploadFile(files[i]);
        }
    
        
    };
    // const fileSelector = document.querySelector('input[type="file"].file_uploader');
    // fileSelector?.addEventListener('change', (evt) => uploadSelectedFiles(evt), false);

    return (
        <Label className="image-picker h-100">
            <div className={`${styles.media_uploader} image-picker-facade`} >
                <Icons.plus className="text-muted-foreground" height="50" width="50" />
            </div>
            <Input type="file" className="input hidden file_uploader" multiple onChange={ uploadSelectedFiles } />
        </Label>
    )
}

export default MediaUploader;