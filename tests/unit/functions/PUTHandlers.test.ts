import { UpdateItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { updateTodo } from "../../../src/db/handlers/PUTHandlers";
import { ResponseStatus } from "../../../src/types/enums";
import { TodoResponse } from "../../../src/types/responses";
import { DEFAULTTODO } from "../../../src/types/defaultValues";

jest.mock("@aws-sdk/client-dynamodb");

const dynamoDBClient = new DynamoDBClient({});

describe("updateTodo", () => {
  const id = "1";
  const taskDescription = "Updated Task Description";
  const dueDate = "2024-12-31";
  const createdDate = "2024-01-01T00:00:00.000Z";
  const completed = true;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a todo successfully", async () => {
    const mockResponse = {};

    (dynamoDBClient.send as jest.Mock).mockResolvedValue(mockResponse);

    const response: TodoResponse = await updateTodo(
      id,
      taskDescription,
      dueDate,
      createdDate,
      completed
    );

    expect(dynamoDBClient.send).toHaveBeenCalledWith(
      expect.any(UpdateItemCommand)
    );

    expect(response.status).toBe(ResponseStatus.SUCCESS);
    expect(response.data.taskDescription).toBe(taskDescription);
    expect(response.data.dueDate).toBe(dueDate);
    expect(response.data.completed).toBe(String(completed));
    expect(response.data.createdDate).toBe(createdDate);
    expect(response.data.id).toBe(id);
  });

  it("should return failure on error", async () => {
    const mockError = new Error("Error updating todo");

    (dynamoDBClient.send as jest.Mock).mockRejectedValue(mockError);

    const response: TodoResponse = await updateTodo(
      id,
      taskDescription,
      dueDate,
      createdDate,
      completed
    );

    expect(dynamoDBClient.send).toHaveBeenCalledWith(
      expect.any(UpdateItemCommand)
    );
    expect(response.status).toBe(ResponseStatus.FAILURE);
    expect(response.data).toEqual(DEFAULTTODO);
    expect(response.error).toBe(mockError.message);
  });
});
