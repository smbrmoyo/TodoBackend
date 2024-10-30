"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamoDBClient = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const config_1 = require("../utils/config");
exports.dynamoDBClient = new client_dynamodb_1.DynamoDBClient({
    region: config_1.awsRegion,
    credentials: {
        accessKeyId: config_1.awsAccessKeyId,
        secretAccessKey: config_1.awsSecretAccessKey,
    },
});
