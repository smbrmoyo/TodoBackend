import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { GetTodoById } from "./types/responses";
import { getTodoById } from "./db/handlers/GETHandlers";
import { ResponseStatus } from "./types/enums";
import { createTodoTable } from "./db/handlers/tableHandlers";

const app: Express = express();
const port = process.env.PORT || 3000;
const httpServer = createServer(app);

app.use(express.json());

(async () => {
  try {
    await createTodoTable();
    console.log("DynamoDB table initialized.");
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

  const result: GetTodoById = await getTodoById(id);

  if (result.status != ResponseStatus.FAILURE) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
