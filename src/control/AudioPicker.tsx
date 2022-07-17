import { useEffect, useState } from "react";
import { Audio } from "./Audio";

export function AudioPicker() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] =
    useState<ConstrainDOMString | null>(null);

  useEffect(() => {
    async function enumerateDevices() {
      const mediaDeviceInfoArr =
        await navigator.mediaDevices.enumerateDevices();
      setDevices(
        mediaDeviceInfoArr.filter(
          (mediaDeviceInfo) => mediaDeviceInfo.kind === "audioinput"
        )
      );
    }
    enumerateDevices();
  }, []);

  useEffect(() => {
    async function getUserMedia() {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setSelectedDeviceId(mediaStream.id);
    }
    if (!selectedDeviceId) {
      getUserMedia();
    }
  }, [selectedDeviceId]);

  return (
    <div>
      <h2>Audio Input Devices</h2>
      <p>
        Select an input device. If device names aren't showing up, please allow
        microphone/audio access in your browser, and mark it to remember your
        decision or always allow, and then reload the page.
      </p>
      <ul>
        {devices.map((mediaDeviceInfo) => (
          <li key={mediaDeviceInfo.deviceId}>
            <button
              onClick={() => setSelectedDeviceId(mediaDeviceInfo.deviceId)}
              aria-pressed={mediaDeviceInfo.deviceId === selectedDeviceId}
            >
              {mediaDeviceInfo.label ||
                `Unknown device ${mediaDeviceInfo.deviceId}`.trim()}
            </button>
          </li>
        ))}
      </ul>
      {selectedDeviceId ? <Audio deviceId={selectedDeviceId} /> : null}
    </div>
  );
}
