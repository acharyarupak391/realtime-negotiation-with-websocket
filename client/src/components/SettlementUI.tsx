import { useCallback } from "react";
import {
  DisputeOrAgreeHandler,
  MessageData,
  RESPONSE_TYPE,
  SENDER,
  SubmitOrModifyHandler,
  WebsocketMessage,
} from "../../types";
import { Card } from "./Card";
import { Interface } from "./Interface";
import { CopyButton } from "./CopyButton";

const SettlementUI = ({
  dbMessages,
  party,
  connectionId,
  send,
}: {
  dbMessages: MessageData[];
  party: SENDER;
  connectionId: string;
  send: (msg: WebsocketMessage) => void;
}) => {
  const handleSubmitOrModify: SubmitOrModifyHandler = useCallback(
    (value, type) => {
      send({
        type,
        value,
        connectionId: connectionId as string,
        sender: SENDER.PARTY_A,
      });
    },
    [connectionId, send]
  );

  const handleDisputeOrAgree: DisputeOrAgreeHandler = useCallback(
    (value, type) => {
      send({
        type,
        value,
        connectionId: connectionId as string,
        sender: SENDER.PARTY_B,
      });
    },
    [connectionId, send]
  );

  return (
    <>
      <div className="flex flex-col gap-4 px-4 py-6 bg-white border border-gray-300 rounded-lg max-h-[700px] overflow-y-auto">
        {dbMessages.length === 0 && (
          <div className="text-center text-gray-400">
            <p>No submissions yet.</p>
            <p>
              {party === SENDER.PARTY_A
                ? "Submit a value to start the negotiation."
                : "Wait for Party A to submit a value."}
            </p>
          </div>
        )}

        {dbMessages.length > 0 &&
          dbMessages.map((message) => (
            <Card
              key={message.id}
              party={message.sender as SENDER}
              type={message.type as RESPONSE_TYPE}
              value={message.value}
              lastValue={message.last_value}
              isYourMessage={message.sender === party}
            />
          ))}
      </div>

      <div>
        {party === SENDER.PARTY_A ? (
          <Interface
            sender={SENDER.PARTY_A}
            handleSend={handleSubmitOrModify}
            messages={dbMessages}
          />
        ) : (
          <Interface
            sender={SENDER.PARTY_B}
            handleSend={handleDisputeOrAgree}
            messages={dbMessages}
          />
        )}
      </div>

      <CopyButton text={connectionId} className="ml-auto">
        {(copied) => (copied ? "Copied to clipboard!" : "Copy Connection ID")}
      </CopyButton>
    </>
  );
};

export { SettlementUI };
