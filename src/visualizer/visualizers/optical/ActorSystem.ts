import P5 from "p5";
import Actor from "./Actor";

//move this to a helper class prob
function shuffleArray(array: Array<any>) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export default class ActorSystem {
  actors: Array<Actor> = [];
  time: number = 0;
  p5: P5;

  //controls
  shuffleTime: number = 800;
  fadeAmount: number = 15;
  connectDistance: number = 40;
  actorSpeed: number = 3;
  wiggleRate: number = 0.2; // 0 - 1 ish recommended range
  wiggleAmount: number = 0.4; // 0 - PI ish recommended range
  wiggleOffsetRange: number = 100; //10's 100's range ish recommended range
  waitTime: number = 80;
  angleSpeed: number = 0.2;

  constructor(p5: P5, n: number, speed: number) {
    this.p5 = p5;

    for (let i = 0; i < n; i++) {
      let a = new Actor(
        p5,
        new P5.Vector(
          this.p5.random(this.p5.width),
          this.p5.random(this.p5.height)
        ),
        this.p5.random(2 * Math.PI) - Math.PI
      );
      this.actors.push(a);
    }
  }

  addActors(n: number) {
    for (let i = 0; i < n; i++) {
      let a = new Actor(
        this.p5,
        new P5.Vector(
          this.p5.random(this.p5.width),
          this.p5.random(this.p5.height)
        ),
        this.p5.random(2 * Math.PI) - Math.PI
      );
      this.actors.push(a);
    }
  }

  removeActors(n: number) {
    try {
      for (let i = 0; i < n; i++) {
        this.actors.pop();
      }
    } catch (ex) {
      //no worries we ran out of actors!
    }
  }

  setControls(
    connectDistance: number,
    actorSpeed: number,
    wiggleRate: number,
    wiggleAmount: number
  ) {
    this.connectDistance = connectDistance;
    this.actorSpeed = actorSpeed;
    this.wiggleRate = wiggleRate;
    this.wiggleAmount = wiggleAmount;

    for (let a of this.actors) {
      a.setControls(this.actorSpeed, this.wiggleRate, this.wiggleAmount);
    }
  }

  update() {
    this.time++;
    if (this.time >= this.shuffleTime) {
      this.time = 0;
      shuffleArray(this.actors);
    }
    for (let i = 0; i < this.actors.length; i++) {
      this.actors[i].update(this.actors[(i + 1) % this.actors.length]);
    }
  }

  display(canvas: P5.Graphics) {
    canvas.fill(0, 0, 0, this.fadeAmount);
    canvas.rect(0, 0, this.p5.width, this.p5.height);
    this.drawActors(canvas);
    this.drawLightning(canvas);
  }

  drawActors(canvas: P5.Graphics) {
    canvas.strokeWeight(2);
    for (let a of this.actors) {
      if (a.type == 0) {
        canvas.stroke(255, 0, 0);
      } else if (a.type == 1) {
        canvas.stroke(0, 0, 255);
      } else {
        canvas.stroke(0, 255, 0);
      }
      canvas.line(
        a.location.x,
        a.location.y,
        a.previousLocation.x,
        a.previousLocation.y
      );
    }
  }

  drawLightning(canvas: P5.Graphics) {
    canvas.strokeWeight(1);
    for (let i = 0; i < this.actors.length; i++) {
      for (let j = i; j < this.actors.length; j++) {
        let a1 = this.actors[i];
        let a2 = this.actors[j];
        if (P5.Vector.dist(a1.location, a2.location) < this.connectDistance) {
          if (a1.type == a2.type) {
            if (a1.type == 0) {
              canvas.stroke(255, 255, 0);
            } else if (a1.type == 1) {
              canvas.stroke(0, 255, 255);
            } else {
              canvas.stroke(255, 0, 255);
            }
          } else {
            canvas.stroke(255, 255, 255, 128);
          }
          canvas.line(
            a1.location.x,
            a1.location.y,
            a2.location.x,
            a2.location.y
          );
        }
      }
    }
  }
}
