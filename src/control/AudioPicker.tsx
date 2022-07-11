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

  return (
    <div>
      <h2>Audio Input Devices</h2>
      <p>Select an input device.</p>
      <ul>
        {devices.map((mediaDeviceInfo) => (
          <li key={mediaDeviceInfo.deviceId}>
            <button
              onClick={() => setSelectedDeviceId(mediaDeviceInfo.deviceId)}
              aria-pressed={mediaDeviceInfo.deviceId === selectedDeviceId}
            >
              {mediaDeviceInfo.label}
            </button>
          </li>
        ))}
      </ul>
      {selectedDeviceId ? <Audio deviceId={selectedDeviceId} /> : null}
    </div>
  );
}
