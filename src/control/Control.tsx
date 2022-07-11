import { useEffect, useState } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";
import { useRegisterView } from "../common/control-channel/useRegisterView";
import { ControlMessages, View } from "../common/control-channel/messages";
import { AudioPicker } from "./AudioPicker";
import { ErrorBoundary } from "../common/ErrorBoundary";

export function Control() {
  const controlChannel = useBroadcastChannel("control");
  const id = useRegisterView("control");
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
      <h1>Control</h1>
      <p>
        <code>{id}</code>
      </p>
      <h2>Active Views</h2>
      <ul>
        {views.map((view) => (
          <li key={view.id}>
            {view.type} - {view.id}
          </li>
        ))}
      </ul>
      <ErrorBoundary>
        <AudioPicker />
      </ErrorBoundary>
    </div>
  );
}
