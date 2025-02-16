import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/sendStatusCode.js";
import { BaseError } from "./base.error.js";

export class BadGateway extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.BAD_GATEWAY, statusMessage || sendStatusCodeMessage(StatusCode.BAD_GATEWAY));
    }
}