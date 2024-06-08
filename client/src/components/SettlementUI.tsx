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
      <div className="flex flex-col gap-4 px-4 py-6 bg-white border border-gray-300 rounded-lg rounded-b-none max-h-[700px] overflow-y-auto relative">
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

      <div className="w-full flex justify-between -mt-[18px]">
        <span className="shadow-md py-1 px-2 rounded-md rounded-t-none backdrop-blur-sm text-gray-900 bg-gray-200">
          {party === SENDER.PARTY_A ? "Party B" : "Party A"}
        </span>

        <span className="shadow-md py-1 px-2 rounded-md rounded-t-none border backdrop-blur-sm bg-blue-600 text-blue-100">
          Party {party} (You)
        </span>
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
