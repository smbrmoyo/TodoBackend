// Todo model

export interface Todo {
  id: string;
  taskDescription: string;
  dueDate: string;
  createdDate: string;
  completed: string;
}

export interface FetchTodosLastKey {
  id: string;
  type: string;
  createdDate: string;
}

export class HttpError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export interface DynamoDBError {
  message: string;
  $metadata: {
    httpStatusCode: number;
  };
}
