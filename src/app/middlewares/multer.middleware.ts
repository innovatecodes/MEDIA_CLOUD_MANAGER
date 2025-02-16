import multer, { FileFilterCallback, MulterError } from "multer";
import { NextFunction, Request, Response } from 'express';
import path from "node:path";
import { ContentTooLargeError } from "../errors/contentTooLarge.error.js";
import { UnsupportedMediaTypeError } from "../errors/unsupportedMediaType.error.js";
import { storage } from "../config/storage.config.js";

// Valida o tipo MIME e extensão do arquivo
const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const allowedExtensions = ['.jpg', '.png', '.webp'];

    // Verifica se o tipo MIME do arquivo é válido (começa com "image/")
    if (!file.mimetype.startsWith(`image/`)) {
        const error = new UnsupportedMediaTypeError(`Tipo MIME inválido. Apenas imagens são permitidas!`);
        error.name = 'InvalidMimeType'; // Define o nome do erro
        return callback(error); // Retorna erro e interrompe o upload
    }

    // Verifica se a extensão do arquivo está na lista de permitidas
    if (!allowedExtensions.includes(path.extname(file.originalname.toLowerCase()))) {
        const error = new MulterError('LIMIT_UNEXPECTED_FILE'); // Erro padrão do multer
        error.message = `Extensão ${path.extname(file.originalname.toLowerCase())} não permitida! Extensões válidas: ${allowedExtensions.join(', ')}`;
        return callback(error); // Retorna erro e interrompe o upload
    }

    callback(null, true);
}

// Configuração do multer com armazenamento personalizado, limites de tamanho e filtro de arquivos
export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Tamanho máximo permitido 2MB
    fileFilter,
}).single('defaultImageFile');

// Middleware para processar o upload de arquivos
export const multerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Realiza o upload do arquivo
    upload(req, res, (error: MulterError | any) => {
        try {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE')
                    throw new ContentTooLargeError('Falha no upload. O tamanho máximo permitido para upload é de 2 MB!');
                if (error.code === 'LIMIT_UNEXPECTED_FILE')
                    throw error;
            }

            if (error?.name === 'InvalidMimeType') throw error;

            return next();
        } catch (error) {
            next(error);
        }
    });
};
