import { useEffect, useRef } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";
import { useRegisterView } from "../common/control-channel/useRegisterView";

const WIDTH = 400;
const HEIGHT = 266;

export function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const id = useRegisterView("visualizer");
  const audioChannel = useBroadcastChannel("audio");
  const bufferRef = useRef<Uint8Array>();

  useEffect(() => {
    const channel = audioChannel.current;
    if (!channel) return;

    const onMessage = (event: MessageEvent<Uint8Array>) => {
      bufferRef.current = event.data;
    };
    const onMessageError = (event: MessageEvent) => {
      console.error(event);
    };
    channel.addEventListener("message", onMessage);
    channel.addEventListener("messageerror", onMessageError);

    return () => {
      channel.removeEventListener("message", onMessage);
      channel.removeEventListener("messageerror", onMessageError);
    };
  }, [audioChannel]);

  useEffect(() => {
    function draw() {
      if (canvasRef.current && bufferRef.current) {
        const bufferLength = bufferRef.current.length;

        const { width, height } = canvasRef.current;
        const canvasCtx = canvasRef.current.getContext("2d")!;
        canvasCtx.fillStyle = "rgb(240, 240, 240)";
        canvasCtx.fillRect(0, 0, width, height);

        const barWidth = width / bufferLength;
        let barHeight;
        let canvasBarHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = bufferRef.current[i];
          canvasBarHeight = HEIGHT * (barHeight / 255);

          canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
          canvasCtx.fillRect(
            x,
            HEIGHT - canvasBarHeight,
            barWidth,
            canvasBarHeight
          );

          x += barWidth + 1;
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

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
