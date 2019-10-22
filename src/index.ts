import "./styles.css";
import Engine from "./Engine";
import Renderer from "./CanvasRenderer";
import Options from "./Options";
import Initializer from "./Initializer";
import World from "./World";

declare global {
  interface Window {
    GIFEncoder: any;
  }
}

let startTime = performance.now();
const pixelsPerCell = 4,
  cols = Math.ceil(window.innerWidth / pixelsPerCell),
  rows = Math.ceil(window.innerHeight / pixelsPerCell),
  renderer = new Renderer(cols, rows, pixelsPerCell, pixelsPerCell),
  options = new Options(),
  initializer = new Initializer(options, renderer),
  engine = new Engine(
    cols, //number of columns
    rows, //number of rows
    onTick,
    30, //desired fps
    initializer
  );
let encoder: any = undefined;
let timeLeftInRecording = 0;
function onTick(world: World, diff: any) {
  if (options.model.isRecording && encoder) {
    encoder.setDelay(this.msPerFrame); //go to next frame every n milliseconds
    encoder.addFrame(renderer.getFrame());
    timeLeftInRecording -= this.msPerFrame;
    console.log(`timeLeftInRecording ${timeLeftInRecording}`);
    if (timeLeftInRecording <= 0) {
      engine.pause();
      encoder.finish();
      encoder.download("download.gif");
    }
  }
  renderer.render(world, diff);
}

window.addEventListener("load", () => {
  function reset() {
    renderer.reset(options.model);
    startTime = performance.now();
    if (options.model.isRecording) {
      encoder = new window.GIFEncoder();
      encoder.setRepeat(0);
      encoder.start();
      timeLeftInRecording = options.model.recordingTime;
      // encoder.setDelay(21\); //go to next frame every n milliseconds
      // encoder.addFrame(renderer.getFrame());
    }
    engine.start(options.model);
  }
  document.onkeydown = ev => {
    if (ev.keyCode == 32) {
      options.model.isRecording = false;
      //space
      reset();
    } else if (ev.keyCode == 82) {
      //r
      options.randomRules();
      reset();
    } else if (ev.keyCode == 67) {
      //c
      options.model.recordingTime = Math.round(performance.now() - startTime);
      console.log(options.model.recordingTime);
    } else if (ev.keyCode == 83) {
      //s
      options.model.isRecording = true;
      reset();
    } //else if (ev.keyCode == 68) {
    //   //d
    //   document.getElementsByClassName(
    //     "close-button"
    //   )[0].style.visibility = this.model.visible ? "hidden" : "initial";
    //   this.model.visible = !this.model.visible;
    // } else if (ev.keyCode == 69) {
    //   this.model.renderCenter = !this.model.renderCenter;
    // }
  };

  reset();
});
