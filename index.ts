import express, { Response } from "express";
import expressWs from "express-ws";
import { initializeDatabase } from "./db";
import { setupWSRoutes } from "./ws/routes";

const expressApp = express();
const port = 8080;

const { app } = expressWs(expressApp);

// Middleware to parse JSON
app.use(express.json());

app.get("/", (_, res: Response) => {
  res.status(200).send("Hello from the server side!");
});

(async () => {
  const db = await initializeDatabase();

  setupWSRoutes(app, db);
})();

app.listen(port, () => {
  console.log(`Node.js server running at http://localhost:${port}`);
});

