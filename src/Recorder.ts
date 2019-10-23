export default class Recorder {
  encoder: any;
  timeLeftInRecording: number;
  targetFrameCount = 1;
  frameCount: number;
  frameDelay = 3;
  done: () => void;
  constructor(done: () => void) {
    this.done = done;
  }

  start(recordingTime: number) {
    this.encoder = new window.GIFEncoder();
    this.encoder.setRepeat(0);
    this.encoder.start();
    this.timeLeftInRecording = recordingTime;
    this.encoder.setDelay(1000 / 30); //this.frameDelay);
    this.frameCount = 10;
  }

  stop() {
    this.encoder.finish();
    this.encoder.download("inja.gif");
    this.encoder = undefined;
    this.done();
  }

  addFrame(frame: any) {
    if (!this.encoder) return;

    // console.log(`adding ${this.frameCount} frames`);
    // for (let index = 0; index < this.frameCount; index++) {
    this.encoder.addFrame(frame);
    //   console.log(`frame ${index}`);
    // }
    this.timeLeftInRecording -= this.frameCount * this.frameDelay;
    // if (this.frameCount > this.targetFrameCount) this.frameCount -= 1;

    console.log(`timeLeftInRecording ${this.timeLeftInRecording}`);
    if (this.timeLeftInRecording <= 0) {
      this.stop();
    }
  }
}
