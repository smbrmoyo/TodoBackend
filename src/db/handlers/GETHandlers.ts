import {
  GetItemCommandInput,
  GetItemCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { ResponseStatus } from "../../types/enums";
import { FetchTodosResponse, TodoResponse } from "../../types/responses";
import { dynamoDBClient } from "../db";
import { HttpError, Todo } from "../../types/models";
import { DEFAULTTODO } from "../../types/defaultValues";

/**
 * Fetches all Todos from the DynamoDB table "TodoTable" with optional filtering and sorting using GSIs.
 *
 * @param {any} lastKey The last evaluated key from the previous query, used for pagination
 * @param {completed | undefined} completed Filter for completed status.
 * @param {string | undefined} sortBy Optional sorting parameter.
 * @returns A promise that resolves to `FetchTodosResponse` or an error message.
 */
export async function fetchTodos(
  lastKey: any,
  completed?: string,
  sortBy?: string
): Promise<FetchTodosResponse> {
  const params: QueryCommandInput = {
    TableName: "TodoTable",
    Limit: 20,
    ExclusiveStartKey: lastKey == "" ? undefined : lastKey,
    ScanIndexForward: sortBy?.startsWith(" ") ?? undefined,
  };

  if (completed == undefined) {
    params.IndexName = sortBy?.includes("dueDate")
      ? "AllDueDateIndex"
      : "AllCreatedIndex";
    params.KeyConditionExpression = "#type = :typeName";
    params.ExpressionAttributeValues = { ":typeName": marshall("Todo") };
    params.ExpressionAttributeNames = { "#type": "type" };
  } else {
    params.IndexName = sortBy?.includes("dueDate")
      ? "CompleteDueDateIndex"
      : "CompleteCreatedDateIndex";
    params.KeyConditionExpression = "completed = :completed";
    params.ExpressionAttributeValues = { ":completed": marshall(completed) };
  }

  try {
    const result = await dynamoDBClient.send(new QueryCommand(params));

    if (result.Items != undefined && result.Items!.length > 0) {
      return {
        data: result.Items.map((item) => unmarshall(item) as Todo),
        lastEvaluatedKey: result.LastEvaluatedKey,
        status: ResponseStatus.SUCCESS,
      };
    } else {
      return {
        data: [],
        lastEvaluatedKey: undefined,
        status: ResponseStatus.SUCCESSEMPTY,
      };
    }
  } catch (error) {
    console.log("Error fetching Todos:\n", error);
    return {
      data: [],
      status: ResponseStatus.FAILURE,
      error: error,
    };
  }
}

/**
 * Fetches a Todo from the DynamoDB table "TodoTable" using its ID.
 *
 * @param {string} id ID of the Todo to get.
 * @returns A promise that resolves to a `TodoResponse` containing the data and status of the request.
 */
export async function getTodoById(id: string): Promise<TodoResponse> {
  const params: GetItemCommandInput = {
    Key: marshall({ id: id }),
    TableName: "TodoTable",
  };
  try {
    const data = await dynamoDBClient.send(new GetItemCommand(params));

    if (data.Item) {
      const post: Todo = unmarshall(data.Item) as Todo;
      return {
        data: post,
        status: ResponseStatus.SUCCESS,
      };
    }
    return {
      data: DEFAULTTODO,
      status: ResponseStatus.FAILURE,
      error: {
        statusCode: 404,
        message:
          "One or more parameter values are not valid. The AttributeValue for a key attribute cannot contain an empty string value. Key: id",
      },
    };
  } catch (error) {
    console.log("Error getting post:\n", error);
    return {
      data: DEFAULTTODO,
      status: ResponseStatus.FAILURE,
      error: {
        statusCode: 404,
        message: (error as Error).message,
      },
    };
  }
}
