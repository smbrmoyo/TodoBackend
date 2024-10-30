import {
  GetItemCommand,
  QueryCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { fetchTodos, getTodoById } from "../../../src/db/handlers/GETHandlers";
import { ResponseStatus } from "../../../src/types/enums";
import { TodoResponse, FetchTodosResponse } from "../../../src/types/responses";
import { DEFAULTTODO } from "../../../src/types/defaultValues";

jest.mock("@aws-sdk/client-dynamodb");

const dynamoDBClient = new DynamoDBClient({});

describe("fetchTodos", () => {
  const lastKey = undefined;
  const completed = undefined;
  const sortBy = "+createdDate";
  const items = [
    marshall({
      id: "1",
      title: "Sample Todo 1",
      completed: "true",
    }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch todos successfully", async () => {
    const mockDynamoResponse = {
      Items: items,
    };

    (dynamoDBClient.send as jest.Mock).mockResolvedValue(mockDynamoResponse);

    const response: FetchTodosResponse = await fetchTodos(
      lastKey,
      completed,
      sortBy
    );

    expect(dynamoDBClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    expect(response.status).toBe(ResponseStatus.SUCCESS);
    expect(response.data).toEqual(items.map((item) => unmarshall(item)));
  });

  it("should return empty success when no todos are found", async () => {
    const mockDynamoResponse = {
      Items: [],
    };

    (dynamoDBClient.send as jest.Mock).mockResolvedValue(mockDynamoResponse);

    const response: FetchTodosResponse = await fetchTodos(
      lastKey,
      completed,
      sortBy
    );

    expect(dynamoDBClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    expect(response.status).toBe(ResponseStatus.SUCCESSEMPTY);
    expect(response.data).toEqual([]);
  });

  it("should return failure on error", async () => {
    const mockError = new Error("Error fetching todos");

    (dynamoDBClient.send as jest.Mock).mockRejectedValue(mockError);

    const response: FetchTodosResponse = await fetchTodos(
      lastKey,
      completed,
      sortBy
    );

    expect(dynamoDBClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    expect(response.status).toBe(ResponseStatus.FAILURE);
    expect(response.data).toEqual([]);
    expect(response.error).toBe(mockError);
  });
});

describe("getTodoById", () => {
  const todoId = "1";
  const item = marshall({
    id: "1",
    title: "Sample Todo 1",
    completed: "true",
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch todo by id successfully", async () => {
    const mockDynamoResponse = {
      Item: item,
    };

    (dynamoDBClient.send as jest.Mock).mockResolvedValue(mockDynamoResponse);

    const response: TodoResponse = await getTodoById(todoId);

    expect(dynamoDBClient.send).toHaveBeenCalledWith(
      expect.any(GetItemCommand)
    );
    expect(response.status).toBe(ResponseStatus.SUCCESS);
    expect(response.data).toEqual(unmarshall(item));
  });

  it("should return failure when todo is not found", async () => {
    const mockDynamoResponse = {
      Item: undefined,
    };

    (dynamoDBClient.send as jest.Mock).mockResolvedValue(mockDynamoResponse);

    const response: TodoResponse = await getTodoById(todoId);

    expect(dynamoDBClient.send).toHaveBeenCalledWith(
      expect.any(GetItemCommand)
    );
    expect(response.status).toBe(ResponseStatus.FAILURE);
    expect(response.data).toEqual(DEFAULTTODO);
    expect(response.error).toBe(
      "One or more parameter values are not valid. The AttributeValue for a key attribute cannot contain an empty string value. Key: id"
    );
  });

  it("should return failure on error", async () => {
    const mockError = new Error("Error fetching todo");

    (dynamoDBClient.send as jest.Mock).mockRejectedValue(mockError);

    const response: TodoResponse = await getTodoById(todoId);

    expect(dynamoDBClient.send).toHaveBeenCalledWith(
      expect.any(GetItemCommand)
    );
    expect(response.status).toBe(ResponseStatus.FAILURE);
    expect(response.data).toEqual(DEFAULTTODO);
    expect(response.error).toBe(mockError);
  });
});
