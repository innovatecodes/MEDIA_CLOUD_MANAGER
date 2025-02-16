import { ContentType, HttpMethod, StatusCode } from "../utils/enums.js";

export interface IMediaRequest {
  mediaId?: number;
  oldCategoryList?: string[];
  categoryList: string[];
  mediaDescription: string;
  title: string;
  postedAt?: Date;
  link: string;
  defaultImageFile?: string;
  cloudinarySecureUrl?: string;
  temporaryPublicId?: string;
}

export interface IMediaResponse {
  mediaId?: number;
  categoryList: string[];
  mediaDescription: string;
  title: string;
  postedAt: Date;
  updatedAt?: Date;
  link: string;
  defaultImageFile: string;
  cloudinarySecureUrl?: string;
  temporaryPublicId?: string;
  // activated?: boolean;
}

export interface IPaginationDetails {
  page?: number,
  totalItems: number;
  limitPerPage: number;
  numberOfPages: number;
  offset: number;
}

export interface ICorsOptions<T extends string | boolean = boolean> {
  origin: T;
  methods: HttpMethod[];
  allowedHeaders: string[];
  preflightContinue: boolean;
  optionsSuccessStatus: StatusCode;
}

export interface ICustomHeader<T extends Record<string, ContentType> | Record<string, string>> {
  setHeader: T;
}

export interface IConnectionConfigSqlServer {
  user: string;  // Nome do usuário para autenticação
  password?: string;  // Senha para autenticação
  database: string;  // Nome do banco de dados
  server: string;  // Endereço do servidor (obrigatório)
  pool: IPool;  // Configurações de pool de conexões
  options?: IOptions;  // Opções adicionais de configuração (opcional)
  port: number;
}

interface IPool {
  max: number;  // Número máximo de conexões no pool
  min: number;  // Número mínimo de conexões no pool
  idleTimeoutMillis: number;  // Tempo limite para conexões inativas (em milissegundos)
}

interface IOptions {
  encrypt: boolean;  // Define se a conexão deve ser criptografada
  trustServerCertificate: boolean;  // Permite confiar em certificados de servidor não validados
}



