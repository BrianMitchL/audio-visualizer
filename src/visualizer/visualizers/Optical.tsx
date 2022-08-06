import { useEffect, useRef } from "react";
import { useAudioBuffer } from "../../common/useAudioBuffer";
import P5 from "p5";
import ActorSystem from "./optical/ActorSystem";

const FRAME_RATE = 60;
const ACTOR_COUNT = 500;
const ACTOR_SPEED = 3;

export default function Optical() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bufferRef = useAudioBuffer();

  useEffect(() => {
    if (!containerRef.current) return;

    const Sketch = (p5: P5) => {
      let actorSystem: ActorSystem;
      p5.setup = () => {
        p5.frameRate(FRAME_RATE);
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        actorSystem = new ActorSystem(p5, ACTOR_COUNT, ACTOR_SPEED);
      };

      p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
      };

      p5.draw = () => {
        if (bufferRef.current) {
          const connectDistance = p5.map(bufferRef.current[2], 0, 175, 10, 70);
          const actorSpeed = p5.map(bufferRef.current[5], 0, 175, 0, 10);
          const wiggleSpeed = p5.map(bufferRef.current[12], 0, 140, 0, 0.6);
          const wiggleAmount = p5.map(bufferRef.current[8], 0, 100, 1.5, 0);
          actorSystem.setControls(
            connectDistance,
            actorSpeed,
            wiggleSpeed,
            wiggleAmount
          );
        }
        actorSystem.update();
        actorSystem.display(p5 as P5.Graphics);
      };
    };

    const sketch = new P5(Sketch, containerRef.current);

    return () => {
      sketch.remove();
    };
  }, [bufferRef]);

  return <div ref={containerRef} />;
}