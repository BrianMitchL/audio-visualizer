import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../common/useTheme";
import { useAudioBuffer } from "../../common/useAudioBuffer";
import p5 from "p5";

export default function P5FrequencyBlue() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bufferRef = useAudioBuffer();
  const { background1 } = useTheme();
  const [sketch, setSketch] = useState<p5 | undefined>(undefined);

  useEffect(() => {
    const Sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      p.draw = () => {
        p.background(background1);

        if (containerRef.current && bufferRef.current) {
          const bufferLength = bufferRef.current.length;

          p.background(background1);

          const barWidth = p.width / bufferLength;
          let barHeight;
          let canvasBarHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = bufferRef.current[i];
            canvasBarHeight = p.height * (barHeight / 255);
            p.fill(p.color(50, 50, barHeight + 100));
            p.rect(x, p.height - canvasBarHeight, barWidth, canvasBarHeight);

            x += barWidth + 1;
          }
        }
      };
    };

    if (!sketch) {
      let inst = new p5(Sketch, containerRef.current as HTMLElement);

      setSketch(inst);
    }

    return () => {
      if (sketch) {
        sketch.remove();
      }
    };
  }, [background1, bufferRef, sketch]);

  return <div ref={containerRef} />;
}
