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
exports.getTodoById = getTodoById;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const enums_1 = require("../../types/enums");
const db_1 = require("../db");
const defaultValues_1 = require("../../types/defaultValues");
function getTodoById(id) {
    return __awaiter(this, void 0, void 0, function* () {
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
                error: "One or more parameter values are not valid. The AttributeValue for a key attribute cannot contain an empty string value. Key: id",
            };
        }
        catch (error) {
            console.log("Error getting post:\n", error);
            return {
                data: defaultValues_1.DEFAULTTODO,
                status: enums_1.ResponseStatus.FAILURE,
                error: error,
            };
        }
    });
}
