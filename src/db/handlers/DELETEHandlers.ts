import {
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { ResponseStatus } from "../../types/enums";
import { dynamoDBClient } from "../db";
import { DeleteTodoResponse } from "../../types/responses";
import { DynamoDBError } from "../../types/models";

/**
 * Deletes a Todo from the DynamoDB table "TodoTable" by ID.
 *
 * @param {string} id ID of the Todo to delete.
 * @returns A promise that resolves to an `DeleteTodoResponse` containing the status of the request.
 */
export async function deleteTodo(id: string): Promise<DeleteTodoResponse> {
  const params: DeleteItemCommandInput = {
    TableName: "TodoTable",
    Key: marshall({ id }),
    ConditionExpression: "attribute_exists(id)",
  };

  try {
    await dynamoDBClient.send(new DeleteItemCommand(params));

    return {
      status: ResponseStatus.SUCCESS,
    };
  } catch (error) {
    console.log("Error deleting Todo:\n", error);

    return {
      status: ResponseStatus.FAILURE,
      error: {
        statusCode: (error as DynamoDBError).$metadata?.httpStatusCode || 400,
        message: (error as DynamoDBError).message || "Unknown Error.",
      },
    };
  }
}
