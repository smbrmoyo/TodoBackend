import express, { Express, Request, Response } from "express";
import { createServer } from "http";

import { DeleteTodoResponse, TodoResponse } from "./types/responses";
import { getTodoById } from "./db/handlers/GETHandlers";
import { ResponseStatus } from "./types/enums";
import { createTodoTable } from "./db/handlers/tableHandlers";
import { createTodo } from "./db/handlers/POSTHandlers";
import { updateTodo } from "./db/handlers/PUTHandlers";
import { deleteTodo } from "./db/handlers/DELETEHandlers";

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

app.get("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const result: TodoResponse = await getTodoById(id);

  if (result.status != ResponseStatus.FAILURE) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.post("/tasks", async (req: Request, res: Response) => {
  const { taskDescription, dueDate, completed } = req.body;

  const result: TodoResponse = await createTodo(
    taskDescription,
    dueDate,
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
