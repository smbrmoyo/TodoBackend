import {
  UpdateItemCommandInput,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { ResponseStatus } from "../../types/enums";
import { TodoResponse } from "../../types/responses";
import { dynamoDBClient } from "../db";
import { DEFAULTTODO } from "../../types/defaultValues";
import { DynamoDBError } from "../../types/models";

/**
 * Updates a Todo in the DynamoDB table "TodoTable".
 *
 * @param {string} id ID of the Todo to update.
 * @param {string} taskDescription Updated description of the Task.
 * @param {string} dueDate Updated due date for the Task.
 * @param {string} createdDate Creation date for the Task.
 * @param {boolean} completed Updated status of the Task.
 * @returns A promise that resolves to an `TodoResponse` containing the updated data and status of the request.
 */
export async function updateTodo(
  id: string,
  taskDescription: string,
  dueDate: string,
  createdDate: string,
  completed: boolean
): Promise<TodoResponse> {
  const params: UpdateItemCommandInput = {
    TableName: "TodoTable",
    Key: marshall({ id }),
    UpdateExpression: "SET #desc = :desc, #due = :due, #comp = :comp",
    ExpressionAttributeNames: {
      "#desc": "taskDescription",
      "#due": "dueDate",
      "#comp": "completed",
    },
    ExpressionAttributeValues: marshall({
      ":desc": taskDescription,
      ":due": dueDate,
      ":comp": String(completed),
    }),
  };

  try {
    await dynamoDBClient.send(new UpdateItemCommand(params));

    return {
      data: {
        id,
        taskDescription: taskDescription,
        createdDate,
        dueDate: dueDate,
        completed: String(completed),
      },
      status: ResponseStatus.SUCCESS,
    };
  } catch (error) {
    console.log("Error updating Todo:\n", error);
    return {
      data: DEFAULTTODO,
      status: ResponseStatus.FAILURE,
      error: {
        statusCode: (error as DynamoDBError).$metadata?.httpStatusCode || 400,
        message: (error as DynamoDBError).message || "Unknown Error.",
      },
    };
  }
}
