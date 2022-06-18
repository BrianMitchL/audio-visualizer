import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/audio-visualizer/",
  build: {
    rollupOptions: {
      input: {
        control: resolve(__dirname, "control/index.html"),
        visualizer: resolve(__dirname, "visualizer/index.html"),
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
