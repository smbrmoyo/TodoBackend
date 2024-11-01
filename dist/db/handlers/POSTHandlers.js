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
exports.createTodo = createTodo;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const uuid_1 = require("uuid");
const enums_1 = require("../../types/enums");
const db_1 = require("../db");
const defaultValues_1 = require("../../types/defaultValues");
function createTodo(taskDescription, dueDate, createdDate, completed) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const id = (0, uuid_1.v4)();
        const newTodo = {
            id,
            taskDescription: taskDescription,
            dueDate: dueDate,
            completed: completed,
            createdDate,
        };
        const params = {
            TableName: "TodoTable",
            Item: {
                id: { S: newTodo.id },
                taskDescription: { S: taskDescription },
                dueDate: { S: dueDate },
                completed: { S: completed },
                createdDate: { S: createdDate },
                type: { S: "Todo" },
            },
        };
        try {
            yield db_1.dynamoDBClient.send(new client_dynamodb_1.PutItemCommand(params));
            return {
                data: newTodo,
                status: enums_1.ResponseStatus.SUCCESS,
            };
        }
        catch (error) {
            console.log("Error creating Todo:\n", error);
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
