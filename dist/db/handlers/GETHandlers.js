"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTodos = fetchTodos;
exports.getTodoById = getTodoById;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const enums_1 = require("../../types/enums");
const db_1 = require("../db");
const defaultValues_1 = require("../../types/defaultValues");
function fetchTodos(lastKey, completed, limit, sortBy) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const params = {
            TableName: "TodoTable",
            Limit: limit,
            ExclusiveStartKey: lastKey ? (0, util_dynamodb_1.marshall)(lastKey) : undefined,
            ScanIndexForward: (_a = sortBy === null || sortBy === void 0 ? void 0 : sortBy.startsWith("+")) !== null && _a !== void 0 ? _a : undefined,
        };
        if (completed == null) {
            params.IndexName = (sortBy === null || sortBy === void 0 ? void 0 : sortBy.includes("dueDate"))
                ? "AllDueDateIndex"
                : "AllCreatedIndex";
            params.KeyConditionExpression = "#type = :typeName";
            params.ExpressionAttributeValues = { ":typeName": (0, util_dynamodb_1.marshall)("Todo") };
            params.ExpressionAttributeNames = { "#type": "type" };
        }
        else {
            params.IndexName = (sortBy === null || sortBy === void 0 ? void 0 : sortBy.includes("dueDate"))
                ? "CompleteDueDateIndex"
                : "CompleteCreatedDateIndex";
            params.KeyConditionExpression = "completed = :completed";
            params.ExpressionAttributeValues = { ":completed": (0, util_dynamodb_1.marshall)(completed) };
        }
        try {
            const result = yield db_1.dynamoDBClient.send(new client_dynamodb_1.QueryCommand(params));
            if (result.Items != undefined && result.Items.length > 0) {
                return {
                    data: result.Items.map((item) => (0, util_dynamodb_1.unmarshall)(item)),
                    lastKey: result.LastEvaluatedKey
                        ? (0, util_dynamodb_1.unmarshall)(result.LastEvaluatedKey)
                        : null,
                    status: enums_1.ResponseStatus.SUCCESS,
                };
            }
            else {
                return {
                    data: [],
                    lastKey: undefined,
                    status: enums_1.ResponseStatus.SUCCESSEMPTY,
                };
            }
        }
        catch (error) {
            console.log("Error fetching Todos:\n", error);
            return {
                data: [],
                status: enums_1.ResponseStatus.FAILURE,
                error: {
                    statusCode: ((_b = error.$metadata) === null || _b === void 0 ? void 0 : _b.httpStatusCode) || 400,
                    message: error.message || "Unknown Error.",
                },
            };
        }
    });
}
function getTodoById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const params = {
            Key: (0, util_dynamodb_1.marshall)({ id: id }),
            TableName: "TodoTable",
        };
        try {
            const data = yield db_1.dynamoDBClient.send(new client_dynamodb_1.GetItemCommand(params));
            if (data.Item) {
                const post = (0, util_dynamodb_1.unmarshall)(data.Item);
                return {
                    data: post,
                    status: enums_1.ResponseStatus.SUCCESS,
                };
            }
            return {
                data: defaultValues_1.DEFAULTTODO,
                status: enums_1.ResponseStatus.FAILURE,
                error: {
                    statusCode: 404,
                    message: "One or more parameter values are not valid. The AttributeValue for a key attribute cannot contain an empty string value. Key: id",
                },
            };
        }
        catch (error) {
            console.log("Error getting post:\n", error);
            return {
                data: defaultValues_1.DEFAULTTODO,
                status: enums_1.ResponseStatus.FAILURE,
                error: {
                    statusCode: ((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) || 400,
                    message: error.message || "Unknown Error.",
                },
            };
        }
    });
}
