import express, { Express, Request, Response } from "express";
import { createServer } from "http";

const app: Express = express();
const port = process.env.PORT || 3000;
const httpServer = createServer(app);

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send(
    "Server Running.\nUse the correct API endpoint path to access resource"
  );
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
