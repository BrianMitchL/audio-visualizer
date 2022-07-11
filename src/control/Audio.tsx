import { useEffect, useRef, useState } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";

export function Audio() {
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const intervalRef = useRef<NodeJS.Timer>();
  const audioChannel = useBroadcastChannel("audio");

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new window.AudioContext();
        const analyzer = new window.AnalyserNode(audioContext, {
          minDecibels: -90,
          maxDecibels: -10,
          smoothingTimeConstant: 0.85,
        });
        analyzer.fftSize = 32;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer, 0);

        setAnalyzer(analyzer);
      })
      .catch((err: Error) => {
        setError(err);
      });

    return () => {
      setAnalyzer(null);
    };
  }, []);

  useEffect(() => {
    if (!analyzer) return;

    const bufferLength = analyzer.frequencyBinCount;
    intervalRef.current = setInterval(() => {
      if (!audioChannel.current) return;

      const data = new Uint8Array(bufferLength);
      analyzer.getByteFrequencyData(data);
      audioChannel.current.postMessage(data);
    }, 16);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [analyzer]);

  if (error) {
    return (
      <p>{error?.message ?? "There was a problem getting the audio stream"}</p>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          clearInterval(intervalRef.current);
        }}
        style={{ display: "block" }}
      >
        Stop
      </button>
    </div>
  );
}
