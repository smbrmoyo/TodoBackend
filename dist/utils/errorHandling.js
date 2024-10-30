"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const models_1 = require("../types/models");
function errorHandler(error, req, res, next) {
    const statusCode = error instanceof models_1.HttpError ? error.statusCode : 500;
    const message = error.message || "An unexpected error occurred";
    res.status(statusCode).json({
        message,
    });
}
