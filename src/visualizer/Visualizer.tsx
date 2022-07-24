import { useRegisterView } from "../common/control-channel/useRegisterView";
import { useEffect, useState } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";
import { ControlMessages } from "../common/control-channel/messages";
import { visualizersObject } from "./visualizers";

export function Visualizer() {
  const id = useRegisterView("visualizer");
  const controlChannel = useBroadcastChannel("control");
  const [vis, setVis] = useState<string | null>(null);

  const VisComponent =
    vis && visualizersObject[vis] ? visualizersObject[vis].Component : null;

  useEffect(() => {
    const channel = controlChannel.current;
    if (!channel) return;

    const onMessage = (event: MessageEvent<ControlMessages>) => {
      if (
        event.data.name === "set-visualizer" &&
        event.data.data.viewId === id
      ) {
        setVis(event.data.data.visualizerFileName);
      }
    };
    channel.addEventListener("message", onMessage);

    return () => {
      channel.removeEventListener("message", onMessage);
    };
  }, [controlChannel, id]);

  return VisComponent ? <VisComponent /> : <p>No visualizer selected</p>;
}
