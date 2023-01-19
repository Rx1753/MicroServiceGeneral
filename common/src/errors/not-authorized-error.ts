import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    constructor(){
        super('Not authorized');
        Object.setPrototypeOf(this ,NotAuthorizedError.prototype);
    }
    statusCode: number = 401;
    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{message:'Not authorized' }]
    }

}