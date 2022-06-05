import { useEffect, useRef, useState } from "react";

const WIDTH = 400;
const HEIGHT = 266;

export function Control() {
  const audioCtxRef = useRef<AudioContext>(new window.AudioContext());
  const analyserRef = useRef<AnalyserNode>(
    audioCtxRef.current.createAnalyser()
  );
  analyserRef.current.minDecibels = -90;
  analyserRef.current.maxDecibels = -10;
  analyserRef.current.smoothingTimeConstant = 0.85;
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
        const gainNode = audioCtxRef.current.createGain();
        const source = audioCtxRef.current.createMediaStreamSource(stream);
        source.connect(gainNode);
        gainNode.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);

        if (canvasRef.current) {
          const { width, height } = canvasRef.current;
          const canvasCtx = canvasRef.current.getContext("2d")!;

          analyserRef.current.fftSize = 64;
          const bufferLength = analyserRef.current.frequencyBinCount;
          const data = new Uint8Array(bufferLength);
          canvasCtx.clearRect(0, 0, width, height);

          function draw() {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteFrequencyData(data);

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
      <button onClick={() => clear()} style={{ display: "block" }}>
        Stop
      </button>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
}
