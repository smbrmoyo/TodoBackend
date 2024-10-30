import { ResponseStatus } from "./enums";
import { Todo } from "./models";

export interface GetTodoById {
  data: Todo;
  status: ResponseStatus;
  error?: any;
}
