import express, { Express, NextFunction, Request, Response } from "express";
import { createServer } from "http";

import {
  DeleteTodoResponse,
  FetchTodosResponse,
  TodoResponse,
} from "./types/responses";
import { fetchTodos, getTodoById } from "./db/handlers/GETHandlers";
import { ResponseStatus } from "./types/enums";
import { createTodoTable } from "./db/handlers/tableHandlers";
import { createTodo } from "./db/handlers/POSTHandlers";
import { updateTodo } from "./db/handlers/PUTHandlers";
import { deleteTodo } from "./db/handlers/DELETEHandlers";
import { HttpError } from "./types/models";

const app: Express = express();
const port = process.env.PORT || 3000;
const httpServer = createServer(app);

app.use(express.json());

(async () => {
  try {
    await createTodoTable();
  } catch (error) {
    console.error("Error initializing DynamoDB table:", error);
    process.exit(1);
  }
})();

app.get("/", async (req: Request, res: Response) => {
  res.send(
    "Server Running.\nUse the correct API endpoint path to access resource"
  );
});

app.get("/tasks", async (req: Request, res: Response) => {
  const { lastKey, completed, sort_by } = req.query;

  const lastKeyString = lastKey != "" ? lastKey : undefined;
  const completedString =
    typeof completed === "string" && completed != "" ? completed : undefined;
  const sortByString = typeof sort_by === "string" ? sort_by : undefined;

  const result: FetchTodosResponse = await fetchTodos(
    lastKeyString,
    completedString,
    sortByString
  );

  if (result.status != ResponseStatus.FAILURE) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.get(
  "/tasks/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const result: TodoResponse = await getTodoById(id);

      if (result.status === "FAILURE") {
        throw new HttpError(result.error || "Item not found", 404);
      }
      res.status(200).json(result);
    } catch (error) {
      let err = error as HttpError;
      res.status(err.statusCode).json(err.message);
      // next(error as HttpError);
    }
  }
);

app.post("/tasks", async (req: Request, res: Response) => {
  const { taskDescription, dueDate, createdDate, completed } = req.body;

  const result: TodoResponse = await createTodo(
    taskDescription,
    dueDate,
    createdDate,
    completed
  );

  if (result.status != ResponseStatus.FAILURE) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.put("/tasks/:id", async (req: Request, res: Response) => {
  const { id, taskDescription, dueDate, createdDate, completed } = req.body;

  const result: TodoResponse = await updateTodo(
    id,
    taskDescription,
    dueDate,
    createdDate,
    completed
  );

  if (result.status != ResponseStatus.FAILURE) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.delete("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const result: DeleteTodoResponse = await deleteTodo(id);

  if (result.status != ResponseStatus.FAILURE) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
