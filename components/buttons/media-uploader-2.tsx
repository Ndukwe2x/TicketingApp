import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import styles from '../styles/styles.module.css';
import { APPCONFIG } from "@/lib/app-config";
import React, { ChangeEvent } from "react";
import axios from "axios";
import signUpload from "../../lib/cloudinary-signature";
import { snakeCase, trainCase } from "change-case";

// interface ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   asChild?: boolean
// }
// type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const uploadFile = async (file: File, onSuccess: (data: object) => void, attempts = 0, folder?: string) => {
    const { title, cloudinaryConfig } = APPCONFIG;
    const cloudName = cloudinaryConfig.cloudName;
    
    let uploadSettings: {} = cloudinaryConfig.uploadSettings;

    if ( folder ) {
        uploadSettings = {
            ...uploadSettings, 
            folder: trainCase(title), 
            public_id: snakeCase(folder)
        };
    }

    const signables = {
        ...uploadSettings,
        source: cloudName
    };

    const { sortedUploadParams, signature } = signUpload(signables, cloudinaryConfig.api.secret);
    
    const uploadData = {
        api_key: cloudinaryConfig.api.key,
        file: file,
        ...sortedUploadParams,
        signature
    }
    
    try {
        axios.post(cloudinaryConfig.api.endpoint, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                onSuccess(response.data);
            })
            .catch(error => {
                if (attempts <= 3) {
                    setTimeout(() => {
                        attempts += 1;
                        uploadFile(file, onSuccess, attempts, folder);
                    }, 2000);
                } else {
                    console.error('Error uploading file: ', error);
                }
            });
    } catch (error) {
        
    }
};

// interface UploadProcessorProps {
//     ev: ChangeEvent<HTMLInputElement>; 
//     onSuccess: (data: object) => void, 
//     onInit?: () => void;
//     assetFoler?: string
// }
const uploadSelectedFiles = async (
    ev: ChangeEvent<HTMLInputElement>, 
    onSuccess: (data: object) => void, 
    onInit?: () => void,
    assetFoler?: string
) => {

    const files = ev.target.files; // Get the selected file

    if ( !files?.length ) {
        console.error('No file selected.');
        return;
    }
    if ( onInit ) onInit();

    // formData.append('tags', 'browser_upload');
    for (let i = 0; i < files.length; i++) {
        uploadFile(files[i], onSuccess, 0, assetFoler);
    }
};

interface UploaderProps extends React.AllHTMLAttributes<HTMLElement> {
    onSuccess: ( data: CloudinaryResponseData ) => void;
    onInit?: () => void;
    assetFolder?: string;
}

const MediaUploader = {
    uploadButton: ( { onSuccess, onInit, assetFolder, ...rest }: UploaderProps ) => {
        
        // const fileSelector = document.querySelector('input[type="file"].file_uploader');
        // fileSelector?.addEventListener('change', (evt) => uploadSelectedFiles(evt), false);
        // const className = rest.className;
        const props = { ...rest, className: `${styles.media_frame} ${rest.className} image-picker-facade`};
        return (
            <Label className={styles.upload_btn + ' image-picker upload-btn h-100'}>
                <div {...props} >
                    <Icons.plus className="text-muted-foreground" height="50" width="50" />
                </div>
                <Input type="file" className="input hidden file_uploader" multiple onChange={ (ev) => uploadSelectedFiles(ev, onSuccess, onInit, assetFolder) } />
            </Label>
        )
    },
    editButton: ( { onSuccess, onInit, assetFolder, ...rest }: UploaderProps ) => {
        const props = { ...rest, className: `${styles.media_frame} ${rest.className} image-picker-facade`};

        return (
            <Label className={`${styles.edit_btn} image-picker h-100`}>
                <div className={ styles.icon_box }>
                    <Icons.edit />
                </div>
                <Input type="file" className="input hidden file_uploader" multiple onChange={ (ev) => uploadSelectedFiles(ev, onSuccess, onInit, assetFolder) } />
            </Label>
        )
    }
}

export default MediaUploader;