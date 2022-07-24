import { useEffect, useRef } from "react";
import { useTheme } from "../../common/useTheme";
import { useAudioBuffer } from "../../common/useAudioBuffer";

const WIDTH = 400;
const HEIGHT = 266;

export default function BasicFrequencyRed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferRef = useAudioBuffer();
  const { background1 } = useTheme();

  useEffect(() => {
    let frame: number;
    function draw() {
      if (canvasRef.current && bufferRef.current) {
        const bufferLength = bufferRef.current.length;

        const { width, height } = canvasRef.current;
        const canvasCtx = canvasRef.current.getContext("2d")!;
        canvasCtx.fillStyle = background1;
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
      frame = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [background1, bufferRef]);

  return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />;
}
