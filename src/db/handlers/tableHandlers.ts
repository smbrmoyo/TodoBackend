import {
  DescribeTableCommand,
  CreateTableCommandInput,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb";

import { dynamoDBClient } from "../db";

/**
 * Creates a DynamoDB table named "TodoTable" if it does not already exist.
 *
 * @returns {Promise<void>} A promise that resolves when the table is
 * created or exists.
 * @throws {Error} Throws an error if there is an issue checking for the
 * table's existence or creating it.
 */
export async function createTodoTable(): Promise<void> {
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

      const createTableCommand = new CreateTableCommand(params);
      await dynamoDBClient.send(createTableCommand);
      console.log(`Table "${tableName}" created successfully.`);
    } else {
      console.error("Error checking table existence:", error);
      throw error;
    }
  }
}
