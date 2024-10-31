import { ResponseStatus } from "./enums";
import { FetchTodosLastKey, Todo } from "./models";

export interface FetchTodosResponse {
  data: Todo[];
  lastEvaluatedKey?: FetchTodosLastKey | null;
  status: ResponseStatus;
  error?: any;
}

export interface TodoResponse {
  data: Todo;
  status: ResponseStatus;
  error?: any;
}

export interface DeleteTodoResponse {
  status: ResponseStatus;
  error?: any;
}
