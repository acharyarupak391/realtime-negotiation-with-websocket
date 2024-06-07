import express, { Request, Response } from "express";
import expressWs from "express-ws";
import { initializeDatabase } from "./db";
import { addNewConnection } from "./db/utils";
import { SENDER } from "./types"
import { setupWSRoutes } from "./ws/routes";
import { isValidConnection } from "./ws/utils";

const expressApp = express();
const port = 8080;

const { app } = expressWs(expressApp);

// Middleware to parse JSON
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello from Node.js!");
});

(async () => {
  const db = await initializeDatabase();

  app.get("/new", async (_, res: Response) => {
    try {
      const connectionId = await addNewConnection(db, SENDER.PARTY_A);
      res.status(200).json({ connectionId });
    } catch (_) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  });

  app.get("/join/:connectionId", async (req: Request, res: Response) => {
    const { connectionId } = req.params;

    try {
      const valid = await isValidConnection(connectionId, db)

      if (!valid) {
        res.status(400).json({ error: "Connection not available!" });
        return;
      }

      res.status(200).json({ message: "Connection updated!" });
    } catch (_) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  })

  app.get("/test", async (_, res: Response) => {
    try {
      const connections = await db.all("SELECT * FROM connections");
      res.json({ connections });
    } catch (_) {
      res.json({ error: "Something went wrong!" });
    }
  });

  setupWSRoutes(app, db);
})();

app.listen(port, () => {
  console.log(`Node.js server running at http://localhost:${port}`);
});

