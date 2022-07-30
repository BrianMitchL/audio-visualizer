import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserCheck } from "../src/BrowserCheck";
import { Visualizer } from "../src/visualizer/Visualizer";
import { ErrorBoundary } from "../src/common/ErrorBoundary";
import "../src/index.css";
import "./visualizer.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserCheck>
      <ErrorBoundary>
        <Visualizer />
      </ErrorBoundary>
    </BrowserCheck>
  </StrictMode>
);
