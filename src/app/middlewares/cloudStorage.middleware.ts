import { Request, Response, NextFunction } from 'express';
import { MediaRepository } from '../repositories/mediaRepository.js';
import { removeFileToCache } from '../utils/utils.js';
import { Base64FileService } from '../services/base64File.service.js';
import { BufferFileService } from '../services/bufferFile.service.js';
import { Cloudinary } from '../base/cloudinary.js';

export class CloudStorageMiddleware extends Cloudinary {
    public filePath: string = '';
    public temporaryPublicId: string = '';

    private readonly _bufferFileService: BufferFileService = new BufferFileService();
    private readonly _base64FileService: Base64FileService = new Base64FileService();
    private readonly _mediaRepository: MediaRepository = new MediaRepository();

    constructor() {
        super();
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async insert(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file && !req.body.defaultImageFile) return next();

            this.filePath = await this.saveAsTemporaryFile(req);

            const fileInserted = await this._insert(this.filePath);

            this.cloudinaryUtils(fileInserted, res);

            removeFileToCache(this.filePath);
            next();
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file && !req.body.defaultImageFile) return next();
          
            const loadedRecord = await this._mediaRepository.getById(Number(req.params.id));

            this.filePath = await this.saveAsTemporaryFile(req);

            this.temporaryPublicId = loadedRecord.recordset.find(column => Number(column.MediaId) === Number(req.params.id))?.TemporaryPublicId;

            const fileUpdated = await this._update(this.filePath, this.temporaryPublicId);

            this.cloudinaryUtils(fileUpdated, res);

            removeFileToCache(this.filePath);

            next();
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) return next();
            this.temporaryPublicId = (await this._mediaRepository.getById(Number(req.params.id))).recordset.find(column => Number(column.MediaId) === Number(req.params.id))?.TemporaryPublicId;
            this._delete(this.temporaryPublicId);
            next();
        } catch (error) {
            next(error);
        }
    }


    public async saveAsTemporaryFile(req: Request) {
        let filePath: string = '';
        if (req.file) filePath = await this._bufferFileService.upload(req);
        if (req.file === undefined && req.body.defaultImageFile) filePath = await this._base64FileService.upload(req);
        return filePath;
    }

}