import { Request } from 'express';
import { ICorsOptions } from "../interfaces/global.interface.js";
import { StatusCode, HttpMethod } from "./enums.js";

// Define as opções para a política CORS (Cross-Origin Resource Sharing)
export const corsOptions = (req: Request, callback: any): void => {
  // Lista de URLs autorizadas (whitelist) para permitir o acesso à API
  let whitelist = ['http://127.0.0.1:4200', 'http://127.0.0.1:3000', 'http://127.0.0.1:5500'];
  // Inicializa a variável de opções CORS (ICorsOptions)
  let corsOptions: ICorsOptions;
  // Verifica se o cabeçalho 'Origin' da requisição está na lista de URLs permitidas
  if (whitelist.indexOf(req.header('origin') ?? "") !== -1)
    corsOptions = {
      // Permite a origem (origin) da requisição
      origin: true,
      // Permite os métodos HTTP especificados
      methods: [
        HttpMethod.GET,    // Permite GET
        HttpMethod.PUT,    // Permite PUT
        HttpMethod.POST,   // Permite POST
        HttpMethod.DELETE, // Permite DELETE
      ],
      // Permite os cabeçalhos específicos
      allowedHeaders: ["Content-Type", "x-api-key", "Authorization"],
      // Não permite que o pré-vôo (preflight request) continue
      preflightContinue: false,
      // Status de sucesso para a resposta de opções (preflight), o código NO_CONTENT indica que não há conteúdo na resposta
      optionsSuccessStatus: StatusCode.NO_CONTENT,
    }
  else
    // Se a origem não estiver na whitelist, limita as opções CORS para apenas permitir GET
    corsOptions = {
      // Não permite a origem da requisição
      origin: false,
      // Permite apenas o método GET
      methods: [
        HttpMethod.GET, // Permite apenas GET
      ],
      // Permite apenas o cabeçalho 'Content-Type'
      allowedHeaders: ["Content-Type"],
      // Não permite que o pré-vôo (preflight request) continue
      preflightContinue: false,
      // Status de sucesso para a resposta de opções (preflight), o código NO_CONTENT indica que não há conteúdo na resposta
      optionsSuccessStatus: StatusCode.NO_CONTENT,
    }
  // Chama o callback com as opções CORS (null para o erro, e corsOptions com as configurações)
  callback(null, corsOptions)
}