class ErrorResponse extends Error {
    statusCode: number;
    message: string;
    success: boolean;
    errors?: string[];
    stack?: string;

    constructor(statusCode: number, message: string, errors: string[] = [] , stack: string = "") {
        
        super(message);
        this.success = false;
        this.statusCode = statusCode;

        if (errors.length) {
            this.errors = errors;
        }
        else {
            this.errors = undefined;
        }

        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

}

export default ErrorResponse;