import { Database } from "sqlite";
import { ResponseInterface, SubmitInterface } from "../types";
import { WebSocket } from "ws";
import { getCurrentMessageStatus, getSettlementStatus, handleWSError, handleWSSuccess, isValidConnection, isValidMessage, isValidSender } from "./utils";
import { addMessage, retrieveAllMessages } from "../db/utils";
import { broadcastMessage, setConnection } from "./connection-pool";

async function handleWSSettlementMessage(msg: SubmitInterface | ResponseInterface, db: Database, ws: WebSocket) {
  const { connectionId, sender, type, value } = msg;

  const isValidMsg = isValidMessage(sender, type, value);
  if (isValidMsg !== true) {
    handleWSError(ws, isValidMsg)

    return;
  }

  const isValidConn = await isValidConnection(connectionId, db);

  if (!isValidConn) {
    handleWSError(ws, "Invalid connection")

    return;
  }

  setConnection(connectionId, ws, sender)

  const messages = await retrieveAllMessages(db, connectionId);
  const { isAlreadySubmitted, isNotRespondedByB, isAgreedByB, isJustDisputedByB, lastAmount } = getSettlementStatus(messages);
  const { isSubmitting, isModifying, isDisputing, isAgreeing } = getCurrentMessageStatus(sender, type, value)

  // handle submission by party A
  if (isSubmitting) {
    if (!isAlreadySubmitted) {
      await addMessage(db, msg)
      broadcastMessage(connectionId, { message: "Submitted" }, "Info")
    } else {
      handleWSError(ws, "Already submitted")
    }

    return
  }

  // handle modification by party A
  if (isModifying) {
    if (!isAlreadySubmitted) {
      handleWSError(ws, "Cannot modify before submitting")
      return;
    }

    if (isAgreedByB) {
      handleWSError(ws, "Settlement Already agreed")
      return;
    }

    if (isNotRespondedByB || isJustDisputedByB) {
      if (lastAmount === value) {
        handleWSError(ws, "Cannot modify with same amount")
        return;
      }

      await addMessage(db, msg);
      broadcastMessage(connectionId, { message: "Modified" }, "Info")
      return;
    }

    handleWSError(ws, "Already modified. Wait for party B to respond")
  }

  // handle dispute by party B
  if (isDisputing) {
    if (!isAlreadySubmitted) {
      handleWSError(ws, "Cannot dispute before submitting")
      return;
    }

    if (isAgreedByB) {
      handleWSError(ws, "Settlement Already agreed")
      return;
    }

    if (isJustDisputedByB) {
      handleWSError(ws, "Already disputed")
      return;
    }

    await addMessage(db, msg);
    broadcastMessage(connectionId, { message: "Disputed" }, "Info")
  }

  // handle agreement by party B
  if (isAgreeing) {
    if (!isAlreadySubmitted) {
      handleWSError(ws, "Cannot agree before submitting")
      return;
    }

    if (isAgreedByB) {
      handleWSError(ws, "Already agreed")
      return;
    }

    if (isJustDisputedByB) {
      handleWSError(ws, "Cannot agree after dispute. Wait for party A to modify")
      return;
    }

    await addMessage(db, msg);
    broadcastMessage(connectionId, { message: "Agreed" }, "Success")
  }
}

export { handleWSSettlementMessage };