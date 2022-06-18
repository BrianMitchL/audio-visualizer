import { useEffect, useRef, useState } from "react";

const WIDTH = 400;
const HEIGHT = 266;

export function Control() {
  const audioCtxRef = useRef<AudioContext>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [error, setError] = useState<Error | null>(null);

  const animationFrameRef = useRef<number>();

  function clear() {
    if (typeof animationFrameRef.current === "number") {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (canvasRef.current) {
      const { width, height } = canvasRef.current;
      const canvasCtx = canvasRef.current.getContext("2d")!;
      canvasCtx.clearRect(0, 0, width, height);
    }
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new window.AudioContext();
        audioCtxRef.current = audioContext;
        const analyzer = new window.AnalyserNode(audioContext, {
          minDecibels: -90,
          maxDecibels: -10,
          smoothingTimeConstant: 0.85,
        });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer, 0);

        if (canvasRef.current) {
          const { width, height } = canvasRef.current;
          const canvasCtx = canvasRef.current.getContext("2d")!;

          analyzer.fftSize = 64;
          const bufferLength = analyzer.frequencyBinCount;
          const data = new Uint8Array(bufferLength);
          canvasCtx.clearRect(0, 0, width, height);

          function draw() {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyzer.getByteFrequencyData(data);

            canvasCtx.fillStyle = "rgb(240, 240, 240)";
            canvasCtx.fillRect(0, 0, width, height);

            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              barHeight = data[i];

              canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
              canvasCtx.fillRect(
                x,
                HEIGHT - barHeight / 2,
                barWidth,
                barHeight / 2
              );

              x += barWidth + 1;
            }
          }

          draw();
        }
      })
      .catch((err: Error) => {
        setError(err);
      });

    return clear;
  }, []);

  if (error) {
    return (
      <p>{error?.message ?? "There was a problem getting the audio stream"}</p>
    );
  }

  return (
    <div>
      <h1>Control</h1>
      <button
        onClick={() => {
          clear();
          audioCtxRef.current?.close();
        }}
        style={{ display: "block" }}
      >
        Stop
      </button>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
}
