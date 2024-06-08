import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageData, WSMessageReceived, WebsocketMessage } from "../../types";
import { pushToast } from "@/components/toast";
import { getValuesFromStorage } from "@/utils/store";

const useWebsocket = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [allMessages, setAllMessages] = useState<WSMessageReceived[]>([]);

  const dbMessages: MessageData[] = useMemo(() => {
    const messages = allMessages.filter(
      (msg) => msg.type === "Info" && Array.isArray(msg.messages)
    );

    if (messages.length === 0) return [];

    const _dbMessages = (messages.at(-1)?.messages || []) as MessageData[];

    let lastValue = 0;
    _dbMessages.forEach((msg, i) => {
      _dbMessages[i].last_value = lastValue.toString();

      if (!isNaN(Number(msg.value))) {
        lastValue = Number(msg.value);
      }
    });

    return _dbMessages;
  }, [allMessages]);

  const alertMessage = useMemo(() => {
    const alertMessages = allMessages.filter(
      (msg) =>
        ["Info", "Error", "Success"].includes(msg.type) &&
        !Array.isArray(msg.messages)
    );

    if (alertMessages.length === 0) return;

    const latestMessage = alertMessages.at(-1);

    if (latestMessage) {
      return latestMessage;
    }
  }, [allMessages]);

  useEffect(() => {
    if (alertMessage) {
      pushToast(alertMessage.message, alertMessage.type);
    }
  }, [alertMessage]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL;

    if (!url) {
      console.error("No Websocket URL provided");
      return;
    }

    let socket: WebSocket;

    try {
      socket = new WebSocket(`${url}/connect`);

      socket.onopen = () => {
        console.log("Connected to WebSocket server");

        const values = getValuesFromStorage();

        if (values && values.party && values.connectionId) {
          socket.send(
            JSON.stringify({
              type: "CONNECT",
              sender: values.party,
              connectionId: values.connectionId,
            })
          );
        }
      };

      socket.onmessage = (event) => {
        try {
          const msg: WSMessageReceived = JSON.parse(event.data);
          setAllMessages((prev) => [...prev, msg]);
        } catch (err) {
          console.error("Error parsing WebSocket message", err);
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };

      setWs(socket);
    } catch (err) {
      console.log("Error", err);
    }

    return () => {
      console.log("Closing WebSocket connection");
      if (socket) socket.close();
    };
  }, []);

  const send = useCallback(
    (msg: WebsocketMessage) => {
      if (!ws) return;

      ws.send(JSON.stringify(msg));
    },
    [ws]
  );

  return { allMessages, send, dbMessages, setAllMessages };
};

export { useWebsocket };
