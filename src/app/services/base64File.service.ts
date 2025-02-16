import * as fs from 'fs/promises';
import { BadRequest } from "../errors/validation.error.js";
import { IUploadFile } from "../interfaces/uploadFile.interface.js";
import { generateRandomFileName } from "../utils/utils.js";
import { Request } from 'express';
import { ContentTooLargeError } from '../errors/contentTooLarge.error.js';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { UnsupportedMediaTypeError } from '../errors/unsupportedMediaType.error.js';
import path, { dirname } from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Base64FileService implements IUploadFile<string> {
    public async upload(req: Request): Promise<string> {
        if (!req.body.defaultImageFile) throw new BadRequest();

        const encodedFile = (req.body.defaultImageFile as string);
        let base64: string;
        let filePath: string = '';
        let decodedBuffer: Buffer;
        let fileTypeInfo: FileTypeResult | undefined;
        const maxSize = 3 * 1024 * 1024;
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        const uploadPath: string = "../../assets/uploads/";

        if (encodedFile.includes(';base64')) base64 = encodedFile.split(';base64,')[1];
        else base64 = encodedFile;

        decodedBuffer = Buffer.from(base64, 'base64');

        fileTypeInfo = await fileTypeFromBuffer(decodedBuffer);

        if (!fileTypeInfo?.mime.startsWith('image/')) throw new UnsupportedMediaTypeError(`Tipo MIME inválido. Apenas imagens são permitidas!`);
        if (!allowedExtensions.includes(fileTypeInfo.ext)) throw new Error(`Extensão ${fileTypeInfo.ext} não permitida! Extensões válidas: ${allowedExtensions.join(', ')}`);
        if (decodedBuffer.byteLength > maxSize) throw new ContentTooLargeError('Falha no upload... O tamanho máximo permitido para upload é de 2 MB!');

        filePath = path.resolve(__dirname, `${uploadPath}${generateRandomFileName('default_image_file')}.${fileTypeInfo.ext}`);

        await fs.writeFile(filePath, decodedBuffer);

        return filePath;
    }
}