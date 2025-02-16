import { Request, Response, NextFunction } from "express";
import { HttpMethod, StatusCode } from "../utils/enums.js";

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  const apiKey = req.header("x-api-key"); // Ou "Authorization" se preferir outro nome

  switch (req.method) {
    case HttpMethod.GET:
      next();
      break;
    case HttpMethod.PUT:
    case HttpMethod.POST:
    case HttpMethod.DELETE:
      if (!apiKey)
        return res.status(StatusCode.UNAUTHORIZED).json({ error: "Chave de API é necessário para acessar este recurso!" });

      if (apiKey !== process.env.API_KEY)
        return res.status(StatusCode.UNAUTHORIZED).json({ error: `Chave de API inválida! ${req.method}` });

      next();
      break;
    default:
      res.status(StatusCode.METHOD_NOT_ALLOWED).json({ error: `Método ${req.method} não é permitido para esse recurso!` })
      break;
  }
};

