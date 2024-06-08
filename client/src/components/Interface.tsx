import { useMemo, useState } from "react";
import {
  DisputeOrAgreeHandler,
  MessageData,
  RESPONSE_TYPE,
  RESPONSE_VALUE,
  SENDER,
  SubmitOrModifyHandler,
} from "../../types";
import { Button } from "./Button";
import {
  IconEdit,
  IconSend2,
  IconThumbDown,
  IconThumbUp,
} from "@tabler/icons-react";

const Interface = ({
  sender,
  handleSend,
  messages,
}: {
  sender: SENDER;
  handleSend: SubmitOrModifyHandler | DisputeOrAgreeHandler;
  messages: MessageData[];
}) => {
  const [inputValue, setInputValue] = useState<number | "">("");

  const isSenderA = sender === SENDER.PARTY_A;

  const { canSubmit, canModify, canAgree, canDispute } = useMemo(() => {
    const lastMessage = messages.at(-1);

    if (!lastMessage)
      return {
        canSubmit: Number(inputValue) > 0,
        canModify: false,
        canDispute: false,
        canAgree: false,
      };

    const isDisputedOnce = Boolean(
      messages.find((m) => m.value === RESPONSE_VALUE.DISPUTE)
    );
    const isJustDisputed = lastMessage.value === RESPONSE_VALUE.DISPUTE;
    const isSubmitted = messages[0].type === RESPONSE_TYPE.SUBMIT;
    const isAgreed = Boolean(
      messages.find((m) => m.value === RESPONSE_VALUE.AGREE)
    );

    return {
      canSubmit: !isSubmitted && Number(inputValue) > 0,
      canModify:
        isSubmitted && !isAgreed && Number(inputValue) > 0
          ? isDisputedOnce
            ? isJustDisputed
            : true
          : false,
      canDispute: isSubmitted && !isJustDisputed && !isAgreed,
      canAgree: isSubmitted && !isJustDisputed && !isAgreed,
    };
  }, [messages, inputValue]);

  return (
    <div className="w-full">
      {isSenderA && (
        <input
          type="number"
          placeholder="Enter a value"
          value={inputValue}
          onChange={(e) => setInputValue(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-2 w-full text-gray-900 mb-4"
          min={0}
        />
      )}

      <div className="flex items-center gap-4 w-full">
        <Button
          className="flex-1"
          variant="outlined"
          onClick={() => {
            handleSend(
              (isSenderA
                ? +Number(inputValue)
                : RESPONSE_VALUE.DISPUTE) as never,
              (isSenderA
                ? RESPONSE_TYPE.MODIFIED
                : RESPONSE_TYPE.RESPONSE) as never
            );
          }}
          accent={isSenderA ? "info" : "danger"}
          disabled={isSenderA ? !canModify : !canDispute}
          Icon={isSenderA ? IconEdit : IconThumbDown}
        >
          {isSenderA ? "Modify" : "Dispute"}
        </Button>

        <Button
          className="flex-1"
          onClick={() => {
            handleSend(
              (isSenderA ? +Number(inputValue) : RESPONSE_VALUE.AGREE) as never,
              (isSenderA
                ? RESPONSE_TYPE.SUBMIT
                : RESPONSE_TYPE.RESPONSE) as never
            );
          }}
          accent={isSenderA ? "default" : "success"}
          disabled={isSenderA ? !canSubmit : !canAgree}
          Icon={isSenderA ? IconSend2 : IconThumbUp}
        >
          {isSenderA ? "Submit" : "Agree"}
        </Button>
      </div>
    </div>
  );
};

export { Interface };
