"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
exports.HttpError = HttpError;
