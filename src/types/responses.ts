import { ResponseStatus } from "./enums";
import { Todo } from "./models";

export interface GetTodoById {
  data: Todo;
  status: ResponseStatus;
  error?: any;
}

export interface CreateTodo {
  data: Todo;
  status: ResponseStatus;
  error?: any;
}
