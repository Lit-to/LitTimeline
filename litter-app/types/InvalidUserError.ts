import * as config from "../routes/config";

class InvalidUserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = config.ERROR_MESSAGES.INVALID_USER;
    }
}

export { InvalidUserError };
