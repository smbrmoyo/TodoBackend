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
exports.updateTodo = updateTodo;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const enums_1 = require("../../types/enums");
const db_1 = require("../db");
const defaultValues_1 = require("../../types/defaultValues");
function updateTodo(id, taskDescription, dueDate, createdDate, completed) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const params = {
            TableName: "TodoTable",
            Key: (0, util_dynamodb_1.marshall)({ id }),
            UpdateExpression: "SET #desc = :desc, #due = :due, #comp = :comp",
            ExpressionAttributeNames: {
                "#desc": "taskDescription",
                "#due": "dueDate",
                "#comp": "completed",
            },
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ":desc": taskDescription,
                ":due": dueDate,
                ":comp": String(completed),
            }),
        };
        try {
            yield db_1.dynamoDBClient.send(new client_dynamodb_1.UpdateItemCommand(params));
            return {
                data: {
                    id,
                    taskDescription: taskDescription,
                    createdDate,
                    dueDate: dueDate,
                    completed: String(completed),
                },
                status: enums_1.ResponseStatus.SUCCESS,
            };
        }
        catch (error) {
            console.log("Error updating Todo:\n", error);
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
