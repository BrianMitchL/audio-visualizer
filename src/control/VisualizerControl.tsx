import { useId } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";
import { SetVisualizer } from "../common/control-channel/messages";
import { visualizersArray } from "../visualizer/visualizers";
import classes from "./Control.module.css";

interface Props {
  id: string;
}

export function VisualizerControl({ id }: Props) {
  const controlChannel = useBroadcastChannel("control");
  const selectId = useId();

  return (
    <section>
      <h2>Visualizer - {id}</h2>

      <form
        className={classes["inline-form"]}
        onSubmit={(event) => {
          event.preventDefault();
          const vis = new FormData(event.currentTarget).get("visualizer");

          if (typeof vis === "string" && controlChannel.current) {
            const message: SetVisualizer = {
              name: "set-visualizer",
              data: {
                viewId: id,
                visualizerFileName: vis,
              },
            };
            controlChannel.current.postMessage(message);
          }
        }}
      >
        <label htmlFor={selectId}>Visualizer</label>
        <select id={selectId} name="visualizer" required>
          {visualizersArray.map((visualizer) => (
            <option key={visualizer.id} value={visualizer.id}>
              {visualizer.display}
            </option>
          ))}
        </select>
        <button type="submit">Set Visualizer</button>
      </form>
    </section>
  );
}
