import { ConnectInterface } from "../types"
import { addNewConnection, updateConnection } from "../db/utils"
import { Database } from "sqlite";
import { WebSocket } from "ws";
import { handleWSError, handleWSSuccess, isValidConnection, isValidSender } from "./utils";
import { broadcastMessage, setConnection } from "./connection-pool";

async function handleWSConnectionMessage(msg: ConnectInterface, db: Database, ws: WebSocket): Promise<string | undefined> {
  const { connectionId, sender } = msg;

  if (!isValidSender(sender)) {
    handleWSError(ws, "Invalid sender")

    return
  }

  if (!connectionId) {
    const newConnectionId = await addNewConnection(db, sender)
    setConnection(newConnectionId, ws, sender)

    handleWSSuccess(ws, `New connection created!`, { connectionId: newConnectionId })

    return newConnectionId;
  }


  const available = await isValidConnection(connectionId, db);
  if (!available) {
    handleWSError(ws, "Invalid ID. No connection found!")
    return;
  }

  await updateConnection(db, msg);
  setConnection(connectionId, ws, sender)

  broadcastMessage(connectionId, { message: `Party ${sender} joined!`, connectionId }, 'Info')
}

export { handleWSConnectionMessage }