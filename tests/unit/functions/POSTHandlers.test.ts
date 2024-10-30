import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { createTodo } from "../../../src/db/handlers/POSTHandlers";
import { ResponseStatus } from "../../../src/types/enums";
import { TodoResponse } from "../../../src/types/responses";
import { DEFAULTTODO } from "../../../src/types/defaultValues";

jest.mock("@aws-sdk/client-dynamodb");

const dynamoDBClient = new DynamoDBClient({});

describe("createTodo", () => {
  const taskDescription = "Sample Task";
  const dueDate = "2024-12-31";
  const completed = false;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a todo successfully", async () => {
    const mockResponse = {};

    (dynamoDBClient.send as jest.Mock).mockResolvedValue(mockResponse);

    const response: TodoResponse = await createTodo(
      taskDescription,
      dueDate,
      completed
    );

    expect(dynamoDBClient.send).toHaveBeenCalledWith(
      expect.any(PutItemCommand)
    );

    expect(response.status).toBe(ResponseStatus.SUCCESS);
    expect(response.data.taskDescription).toBe(taskDescription);
    expect(response.data.dueDate).toBe(dueDate);
    expect(response.data.completed).toBe(String(completed));
    expect(response.data.createdDate).toBeDefined();
    expect(response.data.id).toBeDefined();
  });

  it("should return failure on error", async () => {
    const mockError = new Error("Error creating todo");

    (dynamoDBClient.send as jest.Mock).mockRejectedValue(mockError);

    const response: TodoResponse = await createTodo(
      taskDescription,
      dueDate,
      completed
    );

    expect(dynamoDBClient.send).toHaveBeenCalledWith(
      expect.any(PutItemCommand)
    );
    expect(response.status).toBe(ResponseStatus.FAILURE);
    expect(response.data).toEqual(DEFAULTTODO);
    expect(response.error).toBe(mockError.message);
  });
});
