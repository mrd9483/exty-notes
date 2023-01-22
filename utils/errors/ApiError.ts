// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class ApiError extends Error {
    errorCode = 500;
    constructor(m: string, errorCode: number) {
        super(m);

        this.errorCode = errorCode;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
