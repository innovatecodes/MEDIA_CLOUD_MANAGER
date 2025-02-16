import { Request } from "express";

export interface IUploadFile<T = any> {
    upload(req: Request): Promise<T>;
}



