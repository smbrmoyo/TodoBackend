import { ResponseStatus } from "./enums";
import { Todo } from "./models";

export interface FetchTodosResponse {
  data: Todo[];
  lastEvaluatedKey?: any;
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
