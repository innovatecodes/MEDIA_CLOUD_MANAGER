import { Request } from 'express';
import * as fs from 'node:fs/promises';
import { IUploadFile } from "../interfaces/uploadFile.interface.js";
import { generateRandomFileName } from "../utils/utils.js";
import { BadRequest } from '../errors/validation.error.js';
import path, { dirname } from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class BufferFileService implements IUploadFile<string> {
    public async upload(req: Request) {
        if (!req.file) throw new BadRequest();
        const uploadPath: string = "../../assets/uploads/";
        const filePath = path.resolve(__dirname, `${uploadPath}${generateRandomFileName(req.file.fieldname, req.file.originalname)}`);
        await fs.writeFile(filePath, req.file.buffer);
        return filePath;
    }
}