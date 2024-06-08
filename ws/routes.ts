import expressWs from "express-ws";
import { RESPONSE_TYPE, WebsocketMessage } from "../types";
import { WebSocket } from "ws";
import { handleWSConnectionMessage } from "./handle-connection";
import { Database } from "sqlite";
import { handleWSSettlementMessage } from "./handle-settlement";
import { handleWSError } from "./utils";
import { handleWSDisconnectMessage } from "./handle-disconnect";
import { retrieveAllMessages } from "../db/utils";
import { broadcastMessage } from "./connection-pool";

const setupWSRoutes = (app: expressWs.Application, db: Database) => {
  app.ws("/connect", (ws: WebSocket) => {
    ws.on("open", () => {
      // console.log("OPEN event");
    });

    ws.on("close", () => {
      // console.log("CLOSED");
    });

    ws.on("message", async (msg) => {
      try {
        const parsedMsg: WebsocketMessage = JSON.parse(msg.toString());
        const { type, } = parsedMsg;


        if (type === RESPONSE_TYPE.CONNECT) {
          await handleWSConnectionMessage(parsedMsg, db, ws);

          if (parsedMsg.connectionId) {
            const allMessages = await retrieveAllMessages(db, parsedMsg.connectionId);
            broadcastMessage(parsedMsg.connectionId, { messages: allMessages }, "Info");
          }

          return
        }

        if (type === RESPONSE_TYPE.DISCONNECT) {
          handleWSDisconnectMessage(parsedMsg, db, ws);
          return
        }

        if ([RESPONSE_TYPE.SUBMIT, RESPONSE_TYPE.MODIFIED, RESPONSE_TYPE.RESPONSE].includes(type) && 'value' in parsedMsg) {
          await handleWSSettlementMessage(parsedMsg, db, ws)

          const allMessages = await retrieveAllMessages(db, parsedMsg.connectionId);
          broadcastMessage(parsedMsg.connectionId, { messages: allMessages }, "Info");
          return
        }

        handleWSError(ws, "Invalid type provided")
      } catch (error) {
        console.log("Error parsing message", error);
        handleWSError(ws, "Invalid Format. Please send the message in valid JSON format")
      }
    });
  });
}

export { setupWSRoutes };