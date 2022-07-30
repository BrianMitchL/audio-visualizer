import { RefObject, useEffect } from "react";

export function useResizeCanvas(canvasRef: RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    function handleResize() {
      if (canvasRef.current) {
        const pixelRatio = window.devicePixelRatio ?? 1;
        canvasRef.current.width = window.innerWidth * pixelRatio;
        canvasRef.current.height = window.innerHeight * pixelRatio;
      }
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [canvasRef]);
}
