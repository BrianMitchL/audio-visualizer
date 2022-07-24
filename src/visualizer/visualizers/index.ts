import { ComponentType, lazy, LazyExoticComponent } from "react";

const modules = import.meta.glob("./*.tsx") as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;

function modulePathDisplay(filename: string) {
  return filename
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/\.tsx$/, "")
    .trim();
}

interface Visualizer {
  path: string;
  id: string;
  display: string;
  importFn: () => Promise<{ default: ComponentType }>;
  Component: LazyExoticComponent<ComponentType>;
}

export const visualizersArray = Array.from(
  Object.entries(modules),
  ([path, importFn]): Visualizer => {
    const id = path.split("/").pop() ?? path;

    return {
      path,
      id,
      display: modulePathDisplay(id),
      importFn,
      Component: lazy(() => importFn()),
    };
  }
).sort((a, b) => a.display.localeCompare(b.display));

export const visualizersObject = Object.fromEntries(
  visualizersArray.map((vis) => [vis.id, vis])
);
