import { BroadcastMessage, ConnectionPool, GetConnection, SENDER, SetConnection } from "../types";
import { viewPoolsFromMap } from "./utils";

var pool: ConnectionPool = new Map();

const getConnection: GetConnection = (connectionId) => {
  return pool.get(connectionId);
}

const setConnection: SetConnection = (connectionId, ws, sender) => {
  const connection = getConnection(connectionId);

  pool.set(connectionId, {
    A: sender === SENDER.PARTY_A ? ws : connection?.A || null,
    B: sender === SENDER.PARTY_B ? ws : connection?.B || null,
  });
}

const removeConnection = (connectionId: string, sender: SENDER) => {
  const connection = getConnection(connectionId);

  if (!connection) return;

  if (sender === SENDER.PARTY_A) {
    connection.A = null;
  }

  if (sender === SENDER.PARTY_B) {
    connection.B = null;
  }

  if (!connection.A && !connection.B) {
    pool.delete(connectionId);
  } else {
    pool.set(connectionId, connection);
  }
}

const broadcastMessage: BroadcastMessage = (connectionId, message, type) => {
  const connection = getConnection(connectionId);

  if (!connection) return;

  if (connection.A) {
    connection.A.send(JSON.stringify({ type, ...message }));
  }

  if (connection.B) {
    connection.B.send(JSON.stringify({ type, ...message }));
  }
}

export { getConnection, setConnection, removeConnection, broadcastMessage };