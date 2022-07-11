import { useEffect, useState } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";
import { Audio } from "./Audio";
import { useRegisterView } from "../common/control-channel/useRegisterView";
import { ControlMessages, View } from "../common/control-channel/messages";

export function Control() {
  const audioChannel = useBroadcastChannel("control");
  const id = useRegisterView("control");
  const [views, setViews] = useState<View[]>([]);

  useEffect(() => {
    if (!audioChannel.current) return;

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
    audioChannel.current.addEventListener("message", onMessage);

    return () => {
      if (!audioChannel.current) return;

      audioChannel.current.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <div>
      <h1>Control</h1>
      <p>
        <code>{id}</code>
      </p>
      <ul>
        {views.map((view) => (
          <li key={view.id}>
            {view.type} - {view.id}
          </li>
        ))}
      </ul>
      <Audio />
    </div>
  );
}
