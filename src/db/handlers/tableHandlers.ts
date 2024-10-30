import {
  DescribeTableCommand,
  CreateTableCommandInput,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb";

import { dynamoDBClient } from "../db";

export async function createTodoTable() {
  const tableName = "TodoTable";

  try {
    await dynamoDBClient.send(
      new DescribeTableCommand({ TableName: tableName })
    );

    console.log(`Table "${tableName}" already exists. Skipping creation.`);
  } catch (error) {
    if ((error as Error).name === "ResourceNotFoundException") {
      console.log(`Table "${tableName}" does not exist. Creating table...`);

      const params: CreateTableCommandInput = {
        TableName: tableName,
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
          { AttributeName: "dueDate", AttributeType: "S" },
          { AttributeName: "completed", AttributeType: "S" },
          { AttributeName: "createdDate", AttributeType: "S" },
        ],
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
        GlobalSecondaryIndexes: [
          {
            IndexName: "DueDateIndex",
            KeySchema: [
              { AttributeName: "dueDate", KeyType: "HASH" },
              { AttributeName: "completed", KeyType: "RANGE" },
            ],
            Projection: {
              ProjectionType: "ALL",
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          },
          {
            IndexName: "CreatedDateIndex",
            KeySchema: [
              { AttributeName: "createdDate", KeyType: "HASH" },
              { AttributeName: "completed", KeyType: "RANGE" },
            ],
            Projection: {
              ProjectionType: "ALL",
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          },
        ],
      };

      const createTableCommand = new CreateTableCommand(params);
      await dynamoDBClient.send(createTableCommand);
      console.log(`Table "${tableName}" created successfully.`);
    } else {
      console.error("Error checking table existence:", error);
      throw error;
    }
  }
}
