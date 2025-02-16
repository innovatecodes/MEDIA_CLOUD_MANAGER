import { Response } from "express";

export class BaseError extends Error {
    constructor(private status: number, message: string) {
        super(message)
    }

    public dispatchError(res: Response) {
        res.status(this.status).json({ error: this.message });
    }
}