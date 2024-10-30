import { GetItemCommandInput, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { ResponseStatus } from "../../types/enums";
import { GetTodoById } from "../../types/responses";
import { dynamoDBClient } from "../db";
import { Todo } from "../../types/models";
import { DEFAULTTODO } from "../../types/defaultValues";

/**
 * Fetches a Todo from the DynamoDB table "TodoTable" using its ID.
 *
 * @param {string} id ID of the Todo to get.
 * @returns A promise that resolves to a `GetTodoById` containing the data and status of the request.
 */
export async function getTodoById(id: string): Promise<GetTodoById> {
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
      error:
        "One or more parameter values are not valid. The AttributeValue for a key attribute cannot contain an empty string value. Key: id",
    };
  } catch (error) {
    console.log("Error getting post:\n", error);
    return {
      data: DEFAULTTODO,
      status: ResponseStatus.FAILURE,
      error: error,
    };
  }
}
