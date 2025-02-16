import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/sendStatusCode.js";
import { BaseError } from "./base.error.js";

export class ContentTooLargeError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.CONTENT_TOO_LARGE, statusMessage || sendStatusCodeMessage(StatusCode.CONTENT_TOO_LARGE));
    }
}