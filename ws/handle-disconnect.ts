import { Database } from "sqlite";
import { ConnectInterface } from "../types";
import { WebSocket } from "ws";
import { updateConnection } from "../db/utils";
import { removeConnection } from "./connection-pool";
import { handleWSError } from "./utils";

async function handleWSDisconnectMessage(msg: ConnectInterface, db: Database, ws: WebSocket) {
  if (!msg.connectionId) {
    handleWSError(ws, "Connection ID is required");
    return;
  }

  await updateConnection(db, msg, false);

  removeConnection(msg.connectionId, msg.sender);
}

export { handleWSDisconnectMessage };