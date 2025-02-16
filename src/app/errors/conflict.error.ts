import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/sendStatusCode.js";
import { BaseError } from "./base.error.js";

export class ConflictError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.CONFLICT, statusMessage || sendStatusCodeMessage(StatusCode.CONFLICT));
    }
}