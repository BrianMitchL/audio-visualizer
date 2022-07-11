import { useEffect, useRef } from "react";

export function useBroadcastChannel(name: string) {
  const broadcastChannelRef = useRef<BroadcastChannel>();

  useEffect(() => {
    const channel = new window.BroadcastChannel(name);
    broadcastChannelRef.current = channel;

    return () => {
      channel.close();
    };
  }, [name]);

  return broadcastChannelRef;
}
