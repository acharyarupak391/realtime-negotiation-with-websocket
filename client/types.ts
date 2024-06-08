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

export interface ConnectInterface {
  type: RESPONSE_TYPE.CONNECT | RESPONSE_TYPE.DISCONNECT;
  connectionId?: string;
  sender: SENDER;
}

export interface SubmitInterface {
  type: RESPONSE_TYPE.SUBMIT | RESPONSE_TYPE.MODIFIED;
  connectionId: string;
  sender: SENDER.PARTY_A;
  value: number;
}

export interface ResponseInterface {
  type: RESPONSE_TYPE.RESPONSE;
  connectionId: string;
  sender: SENDER.PARTY_B;
  value: RESPONSE_VALUE;
}

export type WebsocketMessage = ConnectInterface | SubmitInterface | ResponseInterface;

export interface ConnectionData {
  connection_id: string;
  is_party_a_online: boolean;
  is_party_b_online: boolean;
  created_at: string;
}

export interface MessageData {
  id: number;
  connection_id: string;
  type: string;
  value: string;
  last_value?: string;
  sender: string;
  created_at: string;
}

export type WSMessageType = 'Info' | 'Error' | 'Success';

export interface WSMessageReceived {
  type: WSMessageType;
  message: string;
  messages?: MessageData[];
  [key: string]: any;
}

export type SubmitOrModifyHandler = (
  value: number,
  type: RESPONSE_TYPE.SUBMIT | RESPONSE_TYPE.MODIFIED
) => void

export type DisputeOrAgreeHandler = (value: RESPONSE_VALUE, type: RESPONSE_TYPE.RESPONSE) => void

export {
  SENDER,
  RESPONSE_TYPE,
  RESPONSE_VALUE,
}