import { useEffect, useRef } from "react";

export function useBroadcastChannel(name: string) {
  const broadcastChannelRef = useRef<BroadcastChannel>();

  useEffect(() => {
    broadcastChannelRef.current = new window.BroadcastChannel(name);
  }, [name]);

  return broadcastChannelRef;
}
