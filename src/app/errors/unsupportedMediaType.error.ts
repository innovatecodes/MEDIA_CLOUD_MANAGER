
import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/sendStatusCode.js";
import { BaseError } from "./base.error.js";

export class UnsupportedMediaTypeError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.UNSUPPORTED_MEDIA_TYPE, statusMessage || sendStatusCodeMessage(StatusCode.UNSUPPORTED_MEDIA_TYPE))
    }
}
