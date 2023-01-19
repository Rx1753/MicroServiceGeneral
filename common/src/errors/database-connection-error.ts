import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to database';
    statusCode = 500;
    constructor(){
        super('Error connecting to DB');
        
        //only bacause we are extending a built in class
        Object.setPrototypeOf(this , DatabaseConnectionError.prototype)
    }

    serializeErrors(){
        return [{message : this.reason}]
    }
}