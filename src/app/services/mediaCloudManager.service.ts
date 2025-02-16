import { Request, Response } from "express";
import { BadRequest } from "../errors/validation.error.js";
import { NotFoundError } from "../errors/notFound.error.js";
import { EndPoint, StatusCode } from "../utils/enums.js";
import { loadNodeEnvironment } from "../config/dotenv.config.js";
import sql from 'mssql';
import { InternalServerError } from '../errors/internalServer.error.js';
import { GatewayTimeoutError } from '../errors/gatewayTimeout.error.js';
import { ConflictError } from '../errors/conflict.error.js';
import { BadGateway } from '../errors/badGateway.error.js';
import { removeWhiteSpace } from '../utils/utils.js';
import { paginate } from '../utils/paginate.js';
import { MediaRepository } from '../repositories/mediaRepository.js';
import { IMediaRequest, IMediaResponse } from "../interfaces/global.interface.js";

loadNodeEnvironment();

export class MediaCloudManagerService {
  private readonly _mediaRepository: MediaRepository;

  constructor() {
    this._mediaRepository = new MediaRepository();
    this.getAll = this.getAll.bind(this);
    this.getFiltered = this.getFiltered.bind(this);
    this.getById = this.getById.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(req: Request, res: Response = {} as Response) {
    try {
      const page = req.query.page;
      const limitPerPage = req.query.limitPerPage;
      const sortByField = req.query.sortByField as any;
      let reverseOrder = req.query.reverseOrder?.toString().toUpperCase();

      const records = await this._mediaRepository.getAll();

      if (!records.recordset.length) throw new NotFoundError("Nenhum registro foi encontrado!");

      const media: Array<IMediaResponse> = records.recordset.map((column: any) => (this.response(column)));
      const categoryList = ((await this._mediaRepository.getCategoryList()).recordset[0]['CategoryList'] as string).split(',');

      const data = paginate(req, res, Number(page), Number(limitPerPage) || media.length, media, sortByField || media.find(column => column.mediaId)?.mediaId, reverseOrder);

      if (res.headersSent) return; // Impede a execução do código se os cabeçalhos já foram enviados

      return { categoryList, ...data };

    } catch (error) {
      this.Errors(error);
    }
  }

  async getFiltered(req: Request = {} as Request, res: Response = {} as Response): Promise<void | IMediaResponse | IMediaResponse[]> {
    try {
      const searchBy = req.query.search as string;
      const filtered: Array<IMediaResponse> = (await this._mediaRepository.getFiltered(removeWhiteSpace(searchBy))).recordset.map((column => (this.response(column))));
      const hasQueryString = (...args: string[]): boolean => args?.includes('search');

      if (hasQueryString(...Object.keys(req.query))) {
        if (filtered.length === 0 && searchBy.length > 0)
          throw new BadRequest(`Nenhum resultado encontrado para \"${removeWhiteSpace(searchBy)}\"!`);

        if (searchBy.length <= 0)
          throw new BadRequest(`É necessário especificar o tipo de conteúdo para prosseguir com a busca!`);

      } else
        return res.redirect(StatusCode.FOUND, `${process.env.URL}:${process.env.PORT}${EndPoint.MEDIA}`)

      return filtered && filtered.length > 1 ? filtered : filtered[0];
    } catch (error) {
      this.Errors(error);
    }
  }

  async getById(id: number): Promise<IMediaResponse> {
    try {
      const record = await this._mediaRepository.getById(id);

      if (!record.recordset.length || record.recordset.length === 0) throw new NotFoundError("Nenhum registro foi encontrado!");

      const recordFound: Array<IMediaResponse> = record.recordset.map((column: any) => (
        this.response(column)
      ));

      return recordFound[0];
    } catch (error) {
      this.Errors(error);
    }
  }

  async save(req: Request, res: Response = {} as Response): Promise<{ message: string }> {
    try {

      let { categoryList, mediaDescription, title, link } = req.body;

      if (req.headers['content-type']?.includes('application/json') || req.headers['content-type']?.includes('multipart/form-data'))
        req.body = req.body;
      else
        req.body = JSON.parse(req.body);

      categoryList = typeof categoryList === 'object' && Array.isArray(categoryList) && categoryList.length > 0
        ? categoryList.map((value: string) => value.toLowerCase().trimStart())
        : [];

      const body: IMediaRequest = {
        categoryList: categoryList,
        mediaDescription: (mediaDescription as string).trim(),
        title: (title as string).trim(),
        link: (link as string).trim(),
        defaultImageFile: `${process.env.URL}:${process.env.PORT}/uploads/no-image.jpg`,
        cloudinarySecureUrl: (res?.locals as { secure_url: string })?.secure_url,
        temporaryPublicId: (res?.locals as { public_id: string }).public_id?.replace('uploads/', ''),
      }

      await this._mediaRepository.save(body);
      return { message: 'Registro salvo!' };
    } catch (error) {
      this.Errors(error);
    }
  }

  async update(id: number, req: Request, res: Response = {} as Response): Promise<{ message: string }> {
    try {
      let { categoryList, mediaDescription, title, link } = req.body;

      categoryList = typeof categoryList === 'object' && Array.isArray(categoryList) && categoryList.length > 0
        ? categoryList.map((value: string) => value.toLowerCase().trimStart())
        : [];

      const body: IMediaRequest = {
        categoryList: categoryList,
        mediaDescription: mediaDescription || '',
        title: title || '',
        link: link || '',
        cloudinarySecureUrl: (res?.locals as { secure_url: string })?.secure_url,
        temporaryPublicId: (res?.locals as { public_id: string }).public_id?.replace('uploads/', '')
      }

      const data = await this._mediaRepository.getById(id);

      if (!data.recordset.length || data.recordset.length === 0 || data.rowsAffected[0] === 0) throw new NotFoundError("Erro ao tentar atualizar os dados!");

      await this._mediaRepository.update(body, id);

      return { message: 'Registro atualizado!' };
    } catch (error) {
      this.Errors(error);
    }
  }

  async delete(id: number) {
    try {
      const recordDeleted = await this._mediaRepository.delete(id);
      if (recordDeleted.rowsAffected[0] === 0) throw new NotFoundError("Nenhum registro foi encontrado!");
      return;
    } catch (error) {
      this.Errors(error);
    }
  }

  private response(column: any) {
    return {
      mediaId: column.MediaId,
      categoryList: [...(column.CategoryList as string).split(',')].map(property => removeWhiteSpace(property.trimStart())),
      mediaDescription: column.MediaDescription,
      title: column.Title,
      postedAt: column.PostedAt,
      updatedAt: column.UpdatedAt,
      link: column.Link,
      defaultImageFile: column.DefaultImageFile,
      cloudinarySecureUrl: column.CloudinarySecureUrl,
      temporaryPublicId: column.TemporaryPublicId,
    }
  }

  private Errors(error: unknown): never {
    if (error instanceof sql.RequestError && error.code === 'EREQUEST') {
      if (error.message.includes('515'))
        throw new BadRequest('Violação de restrição NOT NULL. O valor não pode ser nulo para este campo!');
      if (error.message.includes('547'))
        throw new BadRequest('Dados inválidos conforme a restrição CHECK. Verifique se os dados atendem às condições especificadas!');
      if (error.message.includes('2627') || error.message.includes('2601'))
        throw new ConflictError('Violação de chave única. Já existe um registro com os mesmos dados!');
      if (error.message.includes('530'))
        throw new ConflictError('Violação de chave primária. Já existe um registro com o mesmo valor de chave primária!');
      throw error.message;
    }
    else if (error instanceof BadRequest)
      throw error;

    if (error instanceof NotFoundError)
      throw error;

    if (error instanceof sql.ConnectionError) {
      switch (error.code) {
        case 'ETIMEOUT':
          throw new GatewayTimeoutError();

        case 'ENOTOPEN':
          throw new InternalServerError("A conexão com o banco de dados não foi aberta. Verifique a configuração e tente novamente!");

        case 'ESOCKET':
          throw new BadGateway("Não foi possível conectar ao servidor. O nome do servidor pode estar incorreto ou há problemas de rede!");

        default:
          throw new InternalServerError("Erro de conexão desconhecido!");
      }
    }
    throw new InternalServerError();
  }






































}


