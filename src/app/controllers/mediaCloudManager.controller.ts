import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/enums.js";
import { MediaCloudManagerService } from "../services/mediaCloudManager.service.js";

export class MediaCloudManagerController {
  private readonly _mediaCloudManagerService: MediaCloudManagerService;

  constructor() { this._mediaCloudManagerService = new MediaCloudManagerService() }

  public getFiltered = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._mediaCloudManagerService.getFiltered(req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._mediaCloudManagerService.getAll(req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._mediaCloudManagerService?.getById(Number(req.params.id));
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public save = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._mediaCloudManagerService.save(req, res);
      res.status(StatusCode.CREATED).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public update  = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._mediaCloudManagerService.update (Number(req.params.id), req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._mediaCloudManagerService.delete(Number(req.params.id));
      res.status(StatusCode.NO_CONTENT).end();
      return;
    } catch (error) {
      next(error);
    }
  }
}
