import { Request, Response, Router } from "express";
import { ContentType, EndPoint, StatusCode } from '../utils/enums.js';
import { CloudStorageMiddleware } from '../middlewares/cloudStorage.middleware.js';
import { MediaCloudManagerController } from '../controllers/mediaCloudManager.controller.js';
import { multerMiddleware } from '../middlewares/multer.middleware.js';
import { apiKeyMiddleware } from "../middlewares/apiKey.middleware.js";
import path, { dirname } from "node:path";
import { fileURLToPath } from 'node:url';
import { validateFieldsMiddleware } from "../middlewares/validateFieldsMiddleware.js";

const routes = Router();
const mediaCloudManagerController: MediaCloudManagerController = new MediaCloudManagerController();
const cloudStorageMiddleware: CloudStorageMiddleware = new CloudStorageMiddleware();
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

routes.get("/", (req: Request, res: Response) => {
    res.setHeader('Content-Type', ContentType.HTML);
    const filePath = path.resolve(__dirname, '..', '..', '..', 'public', 'index.html');
    res.status(StatusCode.OK).sendFile(filePath);
})

routes.get(`${EndPoint.MEDIA}`, mediaCloudManagerController.getAll);
routes.get(`${EndPoint.SEARCH}`, mediaCloudManagerController.getFiltered);
routes.get(`${EndPoint.MEDIA_BY_ID}`, mediaCloudManagerController.getById);
routes.post(`${EndPoint.MEDIA}`, apiKeyMiddleware, multerMiddleware, validateFieldsMiddleware, cloudStorageMiddleware.insert, mediaCloudManagerController.save);
routes.put(`${EndPoint.MEDIA_BY_ID}`, apiKeyMiddleware, multerMiddleware, validateFieldsMiddleware, cloudStorageMiddleware.update, mediaCloudManagerController.update);
routes.delete(`${EndPoint.MEDIA_BY_ID}`, apiKeyMiddleware, cloudStorageMiddleware.delete, mediaCloudManagerController.delete);

export { routes };