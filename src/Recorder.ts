// import * as CCapture from "ccapture.js";

declare global {
  interface Window {
    CCapture: any;
  }
}

export default class Recorder {
  encoder: any;
  timeLeftInRecording: number;
  targetFrameCount = 1;
  frameCount: number;
  frameDelay = 3;
  framesAdded = 0;
  framesPerNumber = [5, 10, 15, 1];
  done: () => void;
  constructor(done: () => void) {
    this.done = done;
  }

  start(recordingTime: number) {
    // this.encoder = new window.GIFEncoder();
    // this.encoder.setRepeat(0);
    // this.encoder.start();
    // this.encoder.setDelay(1000 / 30); //this.frameDelay);
    this.encoder = new window.CCapture({
      format: "gif",
      framerate: 1000 / 30,
      verbose: true,
      quality: 100,
      workersPath: "lib/",
      workers: 10
    });
    this.timeLeftInRecording = recordingTime;
    this.frameCount = 4;
    this.framesAdded = 0;
    this.encoder.start();
  }

  stop() {
    // this.encoder.finish();
    // this.encoder.download("inja.gif");
    this.encoder.stop();

    // default save, will download automatically a file called {name}.extension (webm/gif/tar)
    this.encoder.save();

    this.encoder = undefined;
    this.done();
  }

  addFrame(frame: any) {
    if (!this.encoder) return;
    this.framesAdded++;
    // console.log(`adding ${this.frameCount} frames`);
    for (let index = 0; index < this.frameCount; index++) {
      // this.encoder.addFrame(frame);
      this.encoder.capture(frame);
      //   console.log(`frame ${index}`);
    }
    this.timeLeftInRecording -= 1000 / 30; // this.frameCount * this.frameDelay;
    if (
      this.framesAdded ==
        this.framesPerNumber[this.framesPerNumber.length - this.frameCount] &&
      this.frameCount > this.targetFrameCount
    ) {
      this.frameCount -= 1;
      this.framesAdded = 0;
    }

    console.log(`timeLeftInRecording ${this.timeLeftInRecording}`);
    if (this.timeLeftInRecording <= 0) {
      this.stop();
    }
  }
}
