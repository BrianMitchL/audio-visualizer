# Visualizers

The app shows all `*.tsx` files in this directory as a visualizer.
Each file must export a React component as the default export. The filename
determines the display name by adding a space before each capital letter.
The component can use the `useAudioBuffer()` hook to get a ref to the current
audio data.

## Basic Example

```tsx
import { useEffect, useRef } from "react";
import { useAudioBuffer } from "../../common/useAudioBuffer";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferRef = useAudioBuffer();

  useEffect(() => {
    let frame: number;
    function draw() {
      if (canvasRef.current && bufferRef.current) {
        const bufferLength = bufferRef.current.length;

        // visualizer work here
      }
      frame = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [bufferRef]);

  return <canvas ref={canvasRef} />;
}
```

## Future Visualizers

Beyond handcrafted canvas animations, consider some libraries like
[Pts.](https://ptsjs.org/) and [p5.js](https://p5js.org/).
