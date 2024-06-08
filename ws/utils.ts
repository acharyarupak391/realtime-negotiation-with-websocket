import { Database } from "sqlite";
import { ConnectionData, ConnectionPool, MessageData, RESPONSE_TYPE, RESPONSE_VALUE, SENDER, } from "../types"
import { WebSocket } from "ws";

const isValidSender = (sender: string): boolean => {
  return sender === SENDER.PARTY_A || sender === SENDER.PARTY_B;
}

const isValidConnection = async (connectionId: string, db: Database): Promise<boolean> => {
  try {
    const connectionFromDB = await db.get<ConnectionData>("SELECT * FROM connections WHERE connection_id = ?", connectionId);

    if (!connectionFromDB) return false;

    return true;
  } catch (error) {
    console.log("Error fetching connection from DB", error);
    return false;
  }
}

const isValidMessage = (sender: SENDER, type: RESPONSE_TYPE, value: number | RESPONSE_VALUE): true | string => {
  if (!isValidSender(sender)) {
    return "Invalid sender"
  }
  if (![RESPONSE_TYPE.SUBMIT, RESPONSE_TYPE.MODIFIED, RESPONSE_TYPE.RESPONSE].includes(type)) {
    return "Invalid message type"
  }

  if (typeof value !== 'number' && ![RESPONSE_VALUE.AGREE, RESPONSE_VALUE.DISPUTE].includes(value)) {
    return "Invalid value"
  }

  if (typeof value === 'number' && value < 0) {
    return "Value cannot be negative"
  }

  if (sender === SENDER.PARTY_A && type === RESPONSE_TYPE.RESPONSE) {
    return "Party A cannot send a response";
  }

  if (sender === SENDER.PARTY_B && type !== RESPONSE_TYPE.RESPONSE) {
    return "Party B can only send a response";
  }

  if (type === RESPONSE_TYPE.RESPONSE && value !== RESPONSE_VALUE.AGREE && value !== RESPONSE_VALUE.DISPUTE) {
    return "Party B can only send AGREE or DISPUTE";
  }

  if ([RESPONSE_TYPE.SUBMIT, RESPONSE_TYPE.MODIFIED].includes(type) && typeof value !== 'number') {
    return "Value must be a number"
  }

  return true;
}

const getSettlementStatus = (messages: MessageData[]) => {
  const isNotRespondedByB = messages.filter(m => (m.type !== RESPONSE_TYPE.SUBMIT && m.type !== RESPONSE_TYPE.MODIFIED && m.sender !== SENDER.PARTY_A)).length === 0;

  const isJustDisputedByB = Boolean(messages.at(-1) && messages.at(-1)!.type === RESPONSE_TYPE.RESPONSE && messages.at(-1)!.value === RESPONSE_VALUE.DISPUTE && messages.at(-1)!.sender === SENDER.PARTY_B)

  const isAgreedByB = Boolean(messages.find(m => (m.type === RESPONSE_TYPE.RESPONSE && m.value === RESPONSE_VALUE.AGREE && m.sender === SENDER.PARTY_B)))

  const isAlreadySubmitted = Boolean(messages.find(m => (m.type === RESPONSE_TYPE.SUBMIT && m.sender === SENDER.PARTY_A)))

  const messagesByA = messages.filter(m => m.type === RESPONSE_TYPE.SUBMIT || m.type === RESPONSE_TYPE.MODIFIED)
  const lastAmount = Number(messagesByA.at(-1)?.value || 0)

  return { isNotRespondedByB, isJustDisputedByB, isAgreedByB, isAlreadySubmitted, lastAmount }
}

const getCurrentMessageStatus = (
  sender: SENDER,
  type: RESPONSE_TYPE.SUBMIT | RESPONSE_TYPE.MODIFIED | RESPONSE_TYPE.RESPONSE,
  value: number | RESPONSE_VALUE
) => {
  const isSubmitting = sender === SENDER.PARTY_A && type === RESPONSE_TYPE.SUBMIT;
  const isModifying = sender === SENDER.PARTY_A && type === RESPONSE_TYPE.MODIFIED;
  const isDisputing = sender === SENDER.PARTY_B && type === RESPONSE_TYPE.RESPONSE && value === RESPONSE_VALUE.DISPUTE;
  const isAgreeing = sender === SENDER.PARTY_B && type === RESPONSE_TYPE.RESPONSE && value === RESPONSE_VALUE.AGREE;

  return { isSubmitting, isModifying, isDisputing, isAgreeing }
}

const handleWSError = (ws: WebSocket, message: string, rest: Record<string, string> = {}) => {
  ws.send(
    JSON.stringify({
      type: 'Error',
      message,
      ...rest
    })
  );
}

const handleWSSuccess = (ws: WebSocket, message: string, rest: Record<string, string> = {}) => {
  ws.send(
    JSON.stringify({
      type: 'Success',
      message,
      ...rest
    })
  );
}

const handleWSInfo = (ws: WebSocket, message: string, rest: Record<string, string> = {}) => {
  ws.send(
    JSON.stringify({
      type: 'Info',
      message,
      ...rest
    })
  );
}


const viewPoolsFromMap = (pool: ConnectionPool) => {
  if (pool.size === 0) {
    console.log("Pool is empty")
    return
  }

  console.log("▼▼▼▼▼▼ Pool ▼▼▼▼▼")
  pool.forEach((value, key) => {
    console.log(key, value)
  })
  console.log("▲▲▲▲▲▲ Pool ▲▲▲▲▲")
}


export {
  isValidSender,
  isValidConnection,
  isValidMessage,

  getSettlementStatus,
  getCurrentMessageStatus,

  handleWSError,
  handleWSSuccess,
  handleWSInfo,

  viewPoolsFromMap
}