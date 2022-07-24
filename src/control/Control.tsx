import { useEffect, useState } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";
import { useRegisterView } from "../common/control-channel/useRegisterView";
import { ControlMessages, View } from "../common/control-channel/messages";
import { AudioPicker } from "./AudioPicker";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { VisualizerControl } from "./VisualizerControl";
import classes from "./Control.module.css";

export function Control() {
  const controlChannel = useBroadcastChannel("control");
  useRegisterView("control");
  const [views, setViews] = useState<View[]>([]);

  useEffect(() => {
    const channel = controlChannel.current;
    if (!channel) return;

    const onMessage = (event: MessageEvent<ControlMessages>) => {
      setViews((prevState) => {
        const message = event.data;
        switch (message.name) {
          case "register": {
            return prevState.concat([message.data]);
          }
          case "unregister": {
            return prevState.filter((view) => view.id !== message.data.id);
          }
          case "ping": {
            const exists = prevState.find(
              (view) => view.id === message.data.id
            );

            if (!exists) {
              return prevState.concat([message.data]);
            }
            return prevState.map((view) =>
              view.id === message.data.id ? message.data : view
            );
          }
          default: {
            return prevState;
          }
        }
      });
    };
    channel.addEventListener("message", onMessage);

    return () => {
      channel.removeEventListener("message", onMessage);
    };
  }, [controlChannel]);

  return (
    <div>
      {views.filter((view) => view.type === "control").length > 1 ? (
        <p role="alert" className={classes.alert}>
          <strong>Warning</strong>, using more than one control at a time is not
          supported.
          {import.meta.env.DEV
            ? " Reload the page to clear stale control views due to hot module reloading in development mode."
            : null}
        </p>
      ) : null}
      <a
        href="../visualizer/"
        target="_blank"
        rel="noreferrer noopener"
        className={classes["new-visualizer-window"]}
      >
        Open New Visualizer
      </a>

      <ErrorBoundary>
        <AudioPicker />
      </ErrorBoundary>

      {views
        .filter((view) => view.type === "visualizer")
        .map((view) => (
          <VisualizerControl key={view.id} id={view.id} />
        ))}
    </div>
  );
}
