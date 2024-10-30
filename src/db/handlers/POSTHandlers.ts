import { PutItemCommandInput, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { ResponseStatus } from "../../types/enums";
import { Todo } from "../../types/models";
import { TodoResponse } from "../../types/responses";
import { dynamoDBClient } from "../db";
import { DEFAULTTODO } from "../../types/defaultValues";

/**
 * Creates a Todo and writes it in the DynamoDB table "TodoTable".
 *
 * @param {string} taskDescription Description of the Task,
 * @param {string} dueDate Due date for Task.
 * @param {string} dueDate Creation date for Task.
 * @param {string} completed Status of the Task.
 * @returns A promise that resolves to a `TodoResponse` containing the data and status of the request.
 */
export async function createTodo(
  taskDescription: string,
  dueDate: string,
  createdDate: string,
  completed: string
): Promise<TodoResponse> {
  const id = uuidv4();

  const newTodo: Todo = {
    id,
    taskDescription: taskDescription,
    dueDate: dueDate,
    completed: completed,
    createdDate,
  };

  const params: PutItemCommandInput = {
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
    await dynamoDBClient.send(new PutItemCommand(params));

    return {
      data: newTodo,
      status: ResponseStatus.SUCCESS,
    };
  } catch (error) {
    console.log("Error creating Todo:\n", error);
    return {
      data: DEFAULTTODO,
      status: ResponseStatus.FAILURE,
      error: (error as Error).message,
    };
  }
}
