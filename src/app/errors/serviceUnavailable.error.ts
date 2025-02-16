
import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/sendStatusCode.js";
import { BaseError } from "./base.error.js";

export class ServiceUnavailableError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.SERVICE_UNAVAILABLE, statusMessage || sendStatusCodeMessage(StatusCode.SERVICE_UNAVAILABLE))
    }
}

