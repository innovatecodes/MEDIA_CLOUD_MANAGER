import { v2 as cloudinary, UploadApiResponse, } from 'cloudinary';
import { loadNodeEnvironment } from '../config/dotenv.config.js';
import { Response } from 'express';

loadNodeEnvironment();

export abstract class Cloudinary {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    protected async _insert(filePath: string): Promise<UploadApiResponse> {
        return await cloudinary.uploader.upload(filePath, {
            resource_type: 'image',
            folder: 'uploads' // Define a pasta no Cloudinary onde o arquivo será armazenado
        }).catch((error: any) => {
            throw error;
        });
    }

    protected async _update(filePath: string, id: string): Promise<UploadApiResponse> {
        return await cloudinary.uploader.upload(filePath, {
            public_id: id,
            overwrite: true,
            resource_type: 'image',
            folder: 'uploads'
        }).catch((error: any) => {
            throw error;
        });
    }

    protected async _delete(id: string): Promise<void> {
        if (id)
            await cloudinary.uploader.destroy(`uploads/${id}`, { resource_type: 'image' }
            ).catch((error: any) => { throw error });
    }

    protected cloudinaryUtils(file: UploadApiResponse, res: Response) {
        cloudinary.url(file.public_id, {
            fetch_format: 'auto',
            quality: 'auto',
            format: 'auto',
            url_suffix: 'tube-server-manager'  // Sufixo para melhorar a URL
        });

        // (res?.locals as UploadApiResponse).public_id = uploadResult.public_id;
        // (res?.locals as UploadApiResponse).secure_url = uploadResult.secure_url;
        Object.defineProperties(res.locals, {
            public_id: { value: file.public_id },
            secure_url: { value: file.secure_url }
        }) as UploadApiResponse;
    }
}