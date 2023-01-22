import ApiError from './ApiError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class ResourceNotFoundError extends ApiError {
    constructor() {
        super('Resource Not Found', 404);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
    }
}
