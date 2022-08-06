import { useEffect, useRef } from "react";
import { useTheme } from "../../common/useTheme";
import { useAudioBuffer } from "../../common/useAudioBuffer";
import P5 from "p5";

export default function P5FrequencyBlue() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bufferRef = useAudioBuffer();
  const { background1 } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const Sketch = (p: P5) => {
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

    const sketch = new P5(Sketch, containerRef.current);

    return () => {
      sketch.remove();
    };
  }, [background1, bufferRef]);

  return <div ref={containerRef} />;
}
