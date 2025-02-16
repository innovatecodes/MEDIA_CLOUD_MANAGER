
import express, { Request, Response, NextFunction } from "express";
import { BadRequest } from "../errors/validation.error.js";
import { InternalServerError } from "../errors/internalServer.error.js";
import { NotFoundError } from "../errors/notFound.error.js";
import { ContentTooLargeError } from "../errors/contentTooLarge.error.js";
import { UnsupportedMediaTypeError } from "../errors/unsupportedMediaType.error.js";
import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/sendStatusCode.js";
import { ConflictError } from "../errors/conflict.error.js";
import { GatewayTimeoutError } from "../errors/gatewayTimeout.error.js";
import { BadGateway } from "../errors/badGateway.error.js";
import { ServiceUnavailableError } from "../errors/serviceUnavailable.error.js";

export class ErrorMiddleware {
    setError(app: express.Express) {
        app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            switch (true) {
                case error instanceof BadGateway:
                case error instanceof ConflictError:
                case error instanceof ContentTooLargeError:
                case error instanceof GatewayTimeoutError:
                case error instanceof InternalServerError:
                case error instanceof NotFoundError:
                case error instanceof ServiceUnavailableError:
                case error instanceof UnsupportedMediaTypeError:
                case error instanceof BadRequest:
                      error.dispatchError(res)
                    break;
                default:
                    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message || sendStatusCodeMessage(StatusCode.INTERNAL_SERVER_ERROR) })
                    break;
            }
        });
    }
}

