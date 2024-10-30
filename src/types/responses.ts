import { ResponseStatus } from "./enums";
import { Todo } from "./models";

export interface TodoResponse {
  data: Todo;
  status: ResponseStatus;
  error?: any;
}
