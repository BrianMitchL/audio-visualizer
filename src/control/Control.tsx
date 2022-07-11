import { useEffect, useRef, useState } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";

export function Control() {
  const audioCtxRef = useRef<AudioContext>();
  const intervalRef = useRef<number>();
  const audioChannel = useBroadcastChannel("audio");

  const [error, setError] = useState<Error | null>(null);

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
        analyzer.fftSize = 32;
        const bufferLength = analyzer.frequencyBinCount;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer, 0);

        intervalRef.current = window.setInterval(() => {
          if (!audioChannel.current) return;

          const data = new Uint8Array(bufferLength);
          analyzer.getByteFrequencyData(data);
          audioChannel.current.postMessage(data);
        }, 16);
      })
      .catch((err: Error) => {
        setError(err);
      });

    return () => {
      clearInterval(intervalRef.current);
    };
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
          clearInterval(intervalRef.current);
          audioCtxRef.current?.close();
        }}
        style={{ display: "block" }}
      >
        Stop
      </button>
    </div>
  );
}
