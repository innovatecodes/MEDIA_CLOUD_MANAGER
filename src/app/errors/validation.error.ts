import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/sendStatusCode.js";
import { BaseError } from "./base.error.js";

export class BadRequest extends BaseError{
    constructor(statusMessage?: string){
        super(StatusCode.BAD_REQUEST, statusMessage || sendStatusCodeMessage(StatusCode.BAD_REQUEST));
    }
}