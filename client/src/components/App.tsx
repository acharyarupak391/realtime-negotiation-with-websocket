import { useWebsocket } from "@/hooks/useWebsocket";
import { RESPONSE_TYPE, RESPONSE_VALUE } from "../../types";
import { WelcomeScreen } from "./WelcomeScreen";
import { useCallback, useMemo } from "react";
import { useConnectionStore } from "@/utils/store";
import { FinalScreen } from "./FinalScreen";
import { SettlementUI } from "./SettlementUI";
import { Header } from "./Header";

const App = () => {
  const { send, allMessages, dbMessages, setAllMessages } = useWebsocket();
  const { connectionId, party, setValues } = useConnectionStore();

  const { isAgreed, agreedValue } = useMemo(() => {
    const agreedMsg = dbMessages.find(
      (message) => message.value === RESPONSE_VALUE.AGREE
    );

    if (agreedMsg) {
      return {
        isAgreed: true,
        agreedValue: Number(agreedMsg.last_value),
      };
    }

    return {
      isAgreed: false,
      agreedValue: 0,
    };
  }, [dbMessages]);

  const closeConnection = useCallback(() => {
    setAllMessages([]);
    send({
      type: RESPONSE_TYPE.DISCONNECT,
      sender: party!,
      connectionId: connectionId!,
    });
    setValues({ _connectionId: null, _party: null });
  }, [setAllMessages, setValues, send, party, connectionId]);

  return (
    <>
      <Header />

      <div className="py-4 pt-12 px-4 mx-auto max-w-[600px] min-h-screen flex flex-col gap-4">
        {connectionId && party ? (
          !isAgreed ? (
            <SettlementUI
              dbMessages={dbMessages}
              party={party}
              connectionId={connectionId}
              send={send}
              onClose={closeConnection}
            />
          ) : (
            <FinalScreen amount={agreedValue} onClose={closeConnection} />
          )
        ) : (
          <WelcomeScreen send={send} wsMessages={allMessages} />
        )}
      </div>
    </>
  );
};

export default App;
