import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { deleteTodo } from "../../../src/db/handlers/DELETEHandlers";
import { ResponseStatus } from "../../../src/types/enums";
import { marshall } from "@aws-sdk/util-dynamodb";

jest.mock("@aws-sdk/client-dynamodb");

const dynamoDBClient = new DynamoDBClient({});

describe("deleteTodo", () => {
  const todoId = "123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a Todo successfully", async () => {
    (dynamoDBClient.send as jest.Mock).mockResolvedValue({});

    const result = await deleteTodo(todoId);

    expect(result).toEqual({
      status: ResponseStatus.SUCCESS,
    });
    expect(dynamoDBClient.send).toHaveBeenCalledWith(
      expect.any(DeleteItemCommand)
    );
  });

  it("should return failure when delete operation fails", async () => {
    const errorMessage = "DynamoDB Error";
    (dynamoDBClient.send as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const result = await deleteTodo(todoId);

    expect(result).toEqual({
      status: ResponseStatus.FAILURE,
      error: errorMessage,
    });
    expect(dynamoDBClient.send).toHaveBeenCalledWith(
      expect.any(DeleteItemCommand)
    );
  });
});
