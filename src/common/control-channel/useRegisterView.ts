import { useEffect, useMemo } from "react";
import { useBroadcastChannel } from "../useBroadcastChannel";
import {
  ControlMessages,
  PingView,
  RegisterView,
  UnregisterView,
  ViewType,
} from "./messages";

export function useRegisterView(type: ViewType) {
  const id = useMemo(() => window.crypto.randomUUID(), []);
  const audioChannel = useBroadcastChannel("control");

  useEffect(() => {
    const channel = audioChannel.current;
    if (!channel) return;

    const onMessage = (event: MessageEvent<ControlMessages>) => {
      if (event.data.name === "register") {
        const ping: PingView = {
          name: "ping",
          data: {
            id,
            type,
          },
        };
        channel.postMessage(ping);
      }
    };
    // ping this view when another view registers
    channel.addEventListener("message", onMessage);

    const register: RegisterView = {
      name: "register",
      data: {
        id,
        type,
      },
    };
    channel.postMessage(register);

    const unregister: UnregisterView = {
      name: "unregister",
      data: {
        id,
        type,
      },
    };

    // unregister view when the window is about to close
    window.addEventListener("beforeunload", () => {
      channel.postMessage(unregister);
    });

    return () => {
      channel.removeEventListener("message", onMessage);
      channel.postMessage(unregister);
    };
  }, [id, type]);

  return id;
}
