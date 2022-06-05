import { ReactNode, useMemo } from "react";

interface BrowserCheckProps {
  children?: ReactNode;
}

export function BrowserCheck({ children }: BrowserCheckProps) {
  const errors = useMemo(() => {
    const missingApis: string[] = [];

    /*if (!window.BroadcastChannel) {
      missingApis.push("BroadcastChannel");
    }
    if (!window.AudioContext) {
      missingApis.push("AudioContext");
    }*/

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
