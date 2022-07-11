import { useEffect, useRef } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";
import { useRegisterView } from "../common/control-channel/useRegisterView";

const WIDTH = 400;
const HEIGHT = 266;

export function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const id = useRegisterView("visualizer");
  const audioChannel = useBroadcastChannel("audio");

  useEffect(() => {
    if (!audioChannel.current) return;

    const onMessage = (event: MessageEvent<Uint8Array>) => {
      const bufferLength = event.data.length;

      if (canvasRef.current) {
        const { width, height } = canvasRef.current;
        const canvasCtx = canvasRef.current.getContext("2d")!;

        requestAnimationFrame(() => {
          canvasCtx.fillStyle = "rgb(240, 240, 240)";
          canvasCtx.fillRect(0, 0, width, height);

          const barWidth = width / bufferLength;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = event.data[i];

            canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
            canvasCtx.fillRect(
              x,
              HEIGHT - barHeight / 2,
              barWidth,
              barHeight / 2
            );

            x += barWidth + 1;
          }
        });
      }
    };
    const onMessageError = (event: MessageEvent) => {
      console.error(event);
    };
    audioChannel.current.addEventListener("message", onMessage);
    audioChannel.current.addEventListener("messageerror", onMessageError);

    return () => {
      if (!audioChannel.current) return;

      audioChannel.current.removeEventListener("message", onMessage);
      audioChannel.current.removeEventListener("messageerror", onMessageError);
    };
  }, [audioChannel]);

  return (
    <div>
      <h1>Visualizer</h1>
      <p>
        <code>{id}</code>
      </p>
      <p>Some libraries that might be fun to build some visualizations.</p>
      <ul>
        <li>
          <a href="https://ptsjs.org/">Pts.</a>
        </li>
        <li>
          <a href="https://p5js.org/">p5.js</a>
        </li>
      </ul>

      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
}
