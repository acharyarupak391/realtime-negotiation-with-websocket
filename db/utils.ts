import { Database } from "sqlite";
import { v4 as uuid } from "uuid";
import { ConnectInterface, ConnectionData, MessageData, ResponseInterface, SENDER, SubmitInterface } from "../types";

async function addNewConnection(db: Database, sender: SENDER) {
  const connectionId = uuid();

  await db.run(
    "INSERT INTO connections (connection_id, is_party_a_online, is_party_b_online) VALUES (?, ?, ?)",
    [connectionId, sender === SENDER.PARTY_A, sender === SENDER.PARTY_B],
  );

  return connectionId
}

async function updateConnection(
  db: Database,
  msg: ConnectInterface,
  joined = true
) {
  if (!msg.connectionId) return;

  const updates: string[] = [];
  const values: Array<string | boolean> = [];

  const { connectionId, sender } = msg;
  const isPartyA = sender === SENDER.PARTY_A;
  const isPartyB = sender === SENDER.PARTY_B;

  if (!joined) {
    const connection = await db.get<ConnectionData>(
      "SELECT * FROM connections WHERE connection_id = ?",
      [msg.connectionId],
    );

    if (!connection) return;

    const isPartyAOnline = isPartyA ? joined : connection.is_party_a_online;
    const isPartyBOnline = isPartyB ? joined : connection.is_party_b_online;

    if (!isPartyAOnline && !isPartyBOnline) {
      await db.run("DELETE FROM messages WHERE connection_id = ?", [msg.connectionId]);
      await db.run("DELETE FROM connections WHERE connection_id = ?", [msg.connectionId]);
      return;
    }
  }

  if (isPartyA) {
    updates.push("is_party_a_online = ?");
    values.push(joined);
  }

  if (isPartyB) {
    updates.push("is_party_b_online = ?");
    values.push(joined);
  }

  if (updates.length > 0) {
    const sql = `UPDATE connections SET ${updates.join(", ")} WHERE connection_id = ?`;
    values.push(connectionId);
    await db.run(sql, values);
  }
}

async function addMessage(
  db: Database,
  msg: SubmitInterface | ResponseInterface
) {
  await db.run(
    "INSERT INTO messages (connection_id, type, value, sender) VALUES (?, ?, ?, ?)",
    [msg.connectionId, msg.type, msg.value, msg.sender],
  );
}

async function retrieveAllMessages(db: Database, connectionId: string) {
  try {
    const connections = await db.all<MessageData[]>(
      "SELECT * FROM messages WHERE connection_id = ? ORDER BY created_at ASC",
      [connectionId],
    );
    return connections;
  } catch (error) {
    console.log("Error fetching messages from DB", error);
    return [];
  }
}

export {
  addNewConnection,
  updateConnection,
  addMessage,
  retrieveAllMessages
};
