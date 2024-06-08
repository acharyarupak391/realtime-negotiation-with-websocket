import { WebSocket } from "ws";

enum SENDER {
  PARTY_A = "A",
  PARTY_B = "B",
}

enum RESPONSE_TYPE {
  CONNECT = "CONNECT",
  SUBMIT = "SUBMIT",
  MODIFIED = "MODIFY",
  RESPONSE = "RESPOND",
  DISCONNECT = "DISCONNECT",
}

enum RESPONSE_VALUE {
  AGREE = "AGREE",
  DISPUTE = "DISPUTE",
}

interface ConnectInterface {
  type: RESPONSE_TYPE.CONNECT | RESPONSE_TYPE.DISCONNECT;
  connectionId?: string;
  sender: SENDER;
}

interface SubmitInterface {
  type: RESPONSE_TYPE.SUBMIT | RESPONSE_TYPE.MODIFIED;
  connectionId: string;
  sender: SENDER.PARTY_A;
  value: number;
}

interface ResponseInterface {
  type: RESPONSE_TYPE.RESPONSE;
  connectionId: string;
  sender: SENDER.PARTY_B;
  value: RESPONSE_VALUE;
}

type WebsocketMessage = ConnectInterface | SubmitInterface | ResponseInterface;

type Connection = { A: WebSocket | null; B: WebSocket | null };
type ConnectionPool = Map<string, Connection>

type GetConnection = (connectionId: string) => Connection | undefined;
type SetConnection = (connectionId: string, ws: WebSocket, sender: SENDER) => void;
type BroadcastMessage = (connectionId: string, message: Record<string, any>, type: WSMessageType, key?: string) => void;

interface ConnectionData {
  connection_id: string;
  is_party_a_online: boolean;
  is_party_b_online: boolean;
  created_at: string; // Using string for timestamps is common in TypeScript
}

interface MessageData {
  id: number;
  connection_id: string;
  type: string;
  value: string;
  sender: string;
  created_at: string;
}

type WSMessageType = 'Info' | 'Error' | 'Success';

export {
  SENDER,
  RESPONSE_TYPE,
  RESPONSE_VALUE,
  ConnectInterface,
  SubmitInterface,
  ResponseInterface,
  WebsocketMessage,

  Connection,
  ConnectionPool,

  GetConnection,
  SetConnection,
  BroadcastMessage,

  ConnectionData,
  MessageData,

  WSMessageType
}