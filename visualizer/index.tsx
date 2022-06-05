import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserCheck } from "../src/BrowserCheck";
import { Visualizer } from "../src/visualizer/Visualizer";
import "../src/index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserCheck>
      <Visualizer />
    </BrowserCheck>
  </StrictMode>
);
