import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/sendStatusCode.js";
import { BaseError } from "./base.error.js";

export class InternalServerError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.INTERNAL_SERVER_ERROR, statusMessage || sendStatusCodeMessage(StatusCode.INTERNAL_SERVER_ERROR));
    }
}