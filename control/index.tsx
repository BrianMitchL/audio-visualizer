import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserCheck } from "../src/BrowserCheck";
import { Control } from "../src/control/Control";
import { ErrorBoundary } from "../src/common/ErrorBoundary";
import "../src/index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserCheck>
      <ErrorBoundary>
        <Control />
      </ErrorBoundary>
    </BrowserCheck>
  </StrictMode>
);
