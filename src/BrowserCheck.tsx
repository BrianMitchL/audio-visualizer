import { ReactNode, useMemo } from "react";

interface BrowserCheckProps {
  children?: ReactNode;
}

export function BrowserCheck({ children }: BrowserCheckProps) {
  const errors = useMemo(() => {
    const missingApis: string[] = [];

    if (!navigator?.mediaDevices?.enumerateDevices) {
      missingApis.push("navigator.mediaDevices.enumerateDevices");
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      missingApis.push("navigator.mediaDevices.getUserMedia");
    }

    if (!window.crypto?.randomUUID) {
      missingApis.push("window.crypto.randomUUID");
    }

    if (!window.BroadcastChannel) {
      missingApis.push("window.BroadcastChannel");
    }

    return missingApis;
  }, []);

  if (errors.length > 0) {
    return (
      <div>
        <h1>Upgrade your browser to use this app</h1>
        <p>
          Sorry, this app uses several newer browser APIs and your browser
          doesn't support them all.
        </p>
        <h2 id="missing-apis">Missing API(s)</h2>
        <ul aria-labelledby="missing-apis">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <>{children}</>;
}
