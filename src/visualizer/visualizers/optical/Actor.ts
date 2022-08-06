import P5 from "p5";

const PI = Math.PI;

export default class Actor {
  location: P5.Vector;
  previousLocation: P5.Vector;
  angle: number;
  newAngle: number;
  type: number;
  time: number = 0;
  currentWaitTime: number = 30;
  wiggleOffset: number = 0;
  p5: P5;

  actorSpeed: number = 3;
  wiggleRate: number = 0.2;
  wiggleAmount: number = 0.4;
  wiggleOffsetRange: number = 100;
  waitTime: number = 80;
  angleSpeed: number = 0.2;

  constructor(p5: P5, startingLocation: P5.Vector, startingAngle: number) {
    this.p5 = p5;
    this.location = new P5.Vector(startingLocation.x, startingLocation.y);
    this.previousLocation = new P5.Vector(
      startingLocation.x,
      startingLocation.y
    );
    this.angle = startingAngle;
    this.newAngle = startingAngle;
    this.wiggleOffset = this.p5.random(this.wiggleOffsetRange); //CONST WIGGLE_OFFSET_RANGE
    this.type = this.p5.floor(this.p5.random(3)); //used to be cast to integer
  }

  setControls(actorSpeed: number, wiggleRate: number, wiggleAmount: number) {
    this.actorSpeed = actorSpeed;
    this.wiggleRate = wiggleRate;
    this.wiggleAmount = wiggleAmount;
  }

  update(targetActor: Actor) {
    this.time++;
    if (this.time >= this.currentWaitTime) {
      this.time = 0;
      this.currentWaitTime = this.p5.random(this.waitTime, this.waitTime * 5); //CONST WAIT_TIME, WAIT_TIME*5
      this.calculateNewAngle(targetActor);
    }
    this.smoothRotateToNewHeading();
    this.updateLocation();
  }

  calculateNewAngle(targetActor: Actor) {
    if (this.type === targetActor.type) {
      //if they're friends //fly towards eachother
      this.newAngle = P5.Vector.sub(this.location, targetActor.location)
        .mult(-1)
        .heading();
    } else {
      //fly one direction if they're not partnered
      if (this.type == 1) {
        this.newAngle = (2 * PI) / 3 + PI / 2 - 2 * PI;
      } else if (this.type == 2) {
        this.newAngle = (4 * PI) / 3 + PI / 2 - 2 * PI;
      } else if (this.type == 0) {
        this.newAngle = (6 * PI) / 3 + PI / 2 - 2 * PI;
      }

      //normalize the angle to the negative pi to pi range
      if (this.newAngle > PI) {
        this.newAngle -= 2 * PI;
      }
      if (this.newAngle < -1 * PI) {
        this.newAngle += 2 * PI;
      }
    }
  }

  smoothRotateToNewHeading() {
    if (Math.abs(this.angle - this.newAngle) > PI) {
      if (this.angle < this.newAngle) {
        this.angle -= this.p5.random(this.angleSpeed);
      } else {
        this.angle += this.p5.random(this.angleSpeed);
      }
    } else {
      if (this.angle < this.newAngle) {
        this.angle += this.p5.random(this.angleSpeed);
      } else {
        this.angle -= this.p5.random(this.angleSpeed);
      }
    }

    if (this.angle > PI) {
      this.angle = -1 * PI;
    } else if (this.angle < -1 * PI) {
      this.angle = PI;
    }
  }

  updateLocation() {
    this.previousLocation.x = this.location.x;
    this.previousLocation.y = this.location.y;

    //add some wiggle with sin
    this.location.add(
      P5.Vector.fromAngle(
        this.angle +
          this.p5.sin(
            (this.p5.frameCount + this.wiggleOffset) * this.wiggleRate
          ) *
            this.wiggleRate
      ).mult(this.actorSpeed)
    );
    this.wrapScreenMovement();
  }

  wrapScreenMovement() {
    if (this.location.x > this.p5.width) {
      this.previousLocation.x = 0;
      this.location.x = P5.Vector.fromAngle(this.angle).mult(this.actorSpeed).x;
    }
    if (this.location.x < 0) {
      this.previousLocation.x = this.p5.width;
      this.location.x =
        this.p5.width - P5.Vector.fromAngle(this.angle).mult(this.actorSpeed).x;
    }
    if (this.location.y > this.p5.height) {
      this.previousLocation.y = 0;
      this.location.y = P5.Vector.fromAngle(this.angle).mult(this.actorSpeed).y;
    }
    if (this.location.y < 0) {
      this.previousLocation.y = this.p5.height;
      this.location.y =
        this.p5.height -
        P5.Vector.fromAngle(this.angle).mult(this.actorSpeed).y;
    }
  }
}
