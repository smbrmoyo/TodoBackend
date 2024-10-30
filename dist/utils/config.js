"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsSecretAccessKey = exports.awsAccessKeyId = exports.awsRegion = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.awsRegion = process.env.AWS_REGION;
exports.awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
exports.awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
