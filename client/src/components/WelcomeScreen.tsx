import { useRouter } from "next/router";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { useConnectionStore } from "@/utils/store";
import {
  RESPONSE_TYPE,
  SENDER,
  WSMessageReceived,
  WebsocketMessage,
} from "../../types";
import {
  IconArrowLeft,
  IconArrowsJoin,
  IconCircleLetterA,
  IconCircleLetterB,
} from "@tabler/icons-react";

const WelcomeScreen = ({
  send,
  wsMessages,
}: {
  send: (msg: WebsocketMessage) => void;
  wsMessages: WSMessageReceived[];
}) => {
  const { setValues, party } = useConnectionStore();
  const [joining, setJoining] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const connectMessages = wsMessages.filter(
      (m) => ["Success", "Info"].includes(m.type) && "connectionId" in m
    );

    if (connectMessages.length > 0) {
      setValues({
        _connectionId: connectMessages.at(-1)?.connectionId as string,
      });
    }
  }, [wsMessages, setValues]);

  const handleConnection = (connectionId?: string) => {
    if (!party) {
      return;
    }

    if (connectionId) {
      send({
        type: RESPONSE_TYPE.CONNECT,
        sender: party,
        connectionId: connectionId,
      });
    } else {
      send({
        type: RESPONSE_TYPE.CONNECT,
        sender: party,
      });
    }
  };

  return (
    <div className="w-full shadow-md rounded-lg px-4 py-6">
      {party && (
        <div className="flex justify-between items-end">
          <Button
            variant="outlined"
            onClick={() =>
              joining ? setJoining(false) : setValues({ _party: null })
            }
            className="!p-2 border-none !shadow-none hover:!bg-gray-100"
            size="sm"
            Icon={IconArrowLeft}
            iconLeft
          >
            Back
          </Button>

          <p className="text-gray-900 text-lg font-medium mt-4">
            Party {party}
          </p>
        </div>
      )}

      <h2 className="text-lg font-medium text-gray-900 mb-4 mt-2">
        {party
          ? joining
            ? "Join an existing connection"
            : "Create a new connection or join an existing one"
          : "Select your party"}
      </h2>

      <div className="flex justify-center gap-4">
        {!party ? (
          <div className="flex flex-col gap-4 w-full">
            <Button
              className="w-full gap-4"
              onClick={() => {
                setValues({ _party: SENDER.PARTY_A });
              }}
              Icon={IconCircleLetterA}
              iconLeft
            >
              Party A (I&apos;ll make the offer 💵)
            </Button>
            <Button
              className="w-full gap-4"
              onClick={() => {
                setValues({ _party: SENDER.PARTY_B });
              }}
              Icon={IconCircleLetterB}
              iconLeft
            >
              Party B (I&apos;ll think about it 🤔)
            </Button>
          </div>
        ) : joining ? (
          <div className="flex items-center gap-3 w-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Connection ID"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-900 flex-1"
            />
            <Button
              variant="outlined"
              onClick={() => handleConnection(inputValue)}
              className="px-12"
              Icon={IconArrowsJoin}
            >
              Join
            </Button>
          </div>
        ) : (
          <>
            <Button onClick={() => handleConnection()}>New Connection</Button>
            <Button onClick={() => setJoining(true)}>Join Connection</Button>
          </>
        )}
      </div>
    </div>
  );
};

export { WelcomeScreen };
