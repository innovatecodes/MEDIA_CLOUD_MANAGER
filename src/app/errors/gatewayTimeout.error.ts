
import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/sendStatusCode.js";
import { BaseError } from "./base.error.js";

export class GatewayTimeoutError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.GATEWAY_TIMEOUT, statusMessage || sendStatusCodeMessage(StatusCode.GATEWAY_TIMEOUT))
    }
}
