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
exports.createTodoTable = createTodoTable;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const db_1 = require("../db");
function createTodoTable() {
    return __awaiter(this, void 0, void 0, function* () {
        const tableName = "TodoTable";
        try {
            yield db_1.dynamoDBClient.send(new client_dynamodb_1.DescribeTableCommand({ TableName: tableName }));
            console.log(`Table "${tableName}" already exists. Skipping creation.`);
        }
        catch (error) {
            if (error.name === "ResourceNotFoundException") {
                console.log(`Table "${tableName}" does not exist. Creating table...`);
                const params = {
                    TableName: tableName,
                    AttributeDefinitions: [
                        { AttributeName: "id", AttributeType: "S" },
                        { AttributeName: "dueDate", AttributeType: "S" },
                        { AttributeName: "completed", AttributeType: "S" },
                        { AttributeName: "createdDate", AttributeType: "S" },
                        { AttributeName: "type", AttributeType: "S" },
                    ],
                    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
                    BillingMode: "PAY_PER_REQUEST",
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: "CompleteDueDateIndex",
                            KeySchema: [
                                { AttributeName: "completed", KeyType: "HASH" },
                                { AttributeName: "dueDate", KeyType: "RANGE" },
                            ],
                            Projection: {
                                ProjectionType: "ALL",
                            },
                        },
                        {
                            IndexName: "CompleteCreatedDateIndex",
                            KeySchema: [
                                { AttributeName: "completed", KeyType: "HASH" },
                                { AttributeName: "createdDate", KeyType: "RANGE" },
                            ],
                            Projection: {
                                ProjectionType: "ALL",
                            },
                        },
                        {
                            IndexName: "AllCreatedIndex",
                            KeySchema: [
                                { AttributeName: "type", KeyType: "HASH" },
                                { AttributeName: "createdDate", KeyType: "RANGE" },
                            ],
                            Projection: {
                                ProjectionType: "ALL",
                            },
                        },
                        {
                            IndexName: "AllDueDateIndex",
                            KeySchema: [
                                { AttributeName: "type", KeyType: "HASH" },
                                { AttributeName: "dueDate", KeyType: "RANGE" },
                            ],
                            Projection: {
                                ProjectionType: "ALL",
                            },
                        },
                    ],
                };
                const createTableCommand = new client_dynamodb_1.CreateTableCommand(params);
                yield db_1.dynamoDBClient.send(createTableCommand);
                console.log(`Table "${tableName}" created successfully.`);
            }
            else {
                console.error("Error checking table existence:", error);
                throw error;
            }
        }
    });
}
