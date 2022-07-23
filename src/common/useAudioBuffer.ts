import { useBroadcastChannel } from "./useBroadcastChannel";
import { useEffect, useRef } from "react";

export function useAudioBuffer() {
  const audioChannel = useBroadcastChannel("audio");
  const bufferRef = useRef<Uint8Array>();

  useEffect(() => {
    const channel = audioChannel.current;
    if (!channel) return;

    const onMessage = (event: MessageEvent<Uint8Array>) => {
      bufferRef.current = event.data;
    };
    const onMessageError = (event: MessageEvent) => {
      console.error(event);
    };
    channel.addEventListener("message", onMessage);
    channel.addEventListener("messageerror", onMessageError);

    return () => {
      channel.removeEventListener("message", onMessage);
      channel.removeEventListener("messageerror", onMessageError);
    };
  }, [audioChannel]);

  return bufferRef;
}
