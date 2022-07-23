import { useLayoutEffect, useState } from "react";

interface Theme {
  text1: string;
  text2: string;
  text3: string;
  background1: string;
  background2: string;
  background3: string;
  background4: string;
  accent1: string;
  accent2: string;
  accentText: string;
}

// force state updates when the media query changes so that we re-render
export function useTheme(): Theme {
  const [, setIsDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useLayoutEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setIsDark(event.matches);
    };
    prefersDark.addEventListener("change", handler);

    return () => {
      prefersDark.removeEventListener("change", handler);
    };
  }, []);

  const computedStyle = getComputedStyle(document.documentElement);

  return {
    accent1: computedStyle.getPropertyValue("--accent-1"),
    accent2: computedStyle.getPropertyValue("--accent-2"),
    accentText: computedStyle.getPropertyValue("--accent-text"),
    background1: computedStyle.getPropertyValue("--background-1"),
    background2: computedStyle.getPropertyValue("--background-2"),
    background3: computedStyle.getPropertyValue("--background-3"),
    background4: computedStyle.getPropertyValue("--background-4"),
    text1: computedStyle.getPropertyValue("--text-1"),
    text2: computedStyle.getPropertyValue("--text-2"),
    text3: computedStyle.getPropertyValue("--text-3"),
  };
}
