import { useRegisterView } from "../common/control-channel/useRegisterView";
import { BasicFrequency } from "./visualizers/BasicFrequency";

export function Visualizer() {
  const id = useRegisterView("visualizer");

  return (
    <div>
      <h1>Visualizer</h1>
      <p>
        <code>{id}</code>
      </p>
      <p>Some libraries that might be fun to build some visualizations.</p>
      <ul>
        <li>
          <a href="https://ptsjs.org/">Pts.</a>
        </li>
        <li>
          <a href="https://p5js.org/">p5.js</a>
        </li>
      </ul>

      <BasicFrequency />
    </div>
  );
}
