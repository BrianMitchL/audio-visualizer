import { useEffect, useRef, useState } from "react";
import { useBroadcastChannel } from "../common/useBroadcastChannel";

interface MediaInfo {
  name: string;
}

interface AudioProps {
  deviceId: ConstrainDOMString;
}

export function Audio({ deviceId }: AudioProps) {
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const intervalRef = useRef<NodeJS.Timer>();
  const audioChannel = useBroadcastChannel("audio");

  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);

  useEffect(() => {
    async function initializeAudio() {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId },
        video: false,
      });

      const track = mediaStream.getAudioTracks()[0];
      if (track?.label) {
        setMediaInfo({ name: track.label });
      }
      const audioContext = new window.AudioContext();
      const analyzer = new window.AnalyserNode(audioContext, {
        minDecibels: -90,
        maxDecibels: -10,
        smoothingTimeConstant: 0.85,
      });
      analyzer.fftSize = 32;
      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyzer, 0);

      setAnalyzer(analyzer);
    }

    initializeAudio();

    return () => {
      setAnalyzer(null);
      setMediaInfo(null);
    };
  }, [deviceId]);

  useEffect(() => {
    if (!analyzer) return;

    const bufferLength = analyzer.frequencyBinCount;
    intervalRef.current = setInterval(() => {
      if (!audioChannel.current) return;

      const data = new Uint8Array(bufferLength);
      analyzer.getByteFrequencyData(data);
      audioChannel.current.postMessage(data);
    }, 5);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [analyzer, audioChannel]);

  return (
    <div>
      {mediaInfo ? (
        <p>
          Playing from audio source <code>{mediaInfo.name}</code>.
        </p>
      ) : null}
      <button
        onClick={() => {
          clearInterval(intervalRef.current);
        }}
        style={{ display: "block" }}
      >
        Stop Interval
      </button>
    </div>
  );
}
