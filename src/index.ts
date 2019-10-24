import "./styles.css";
import Engine from "./Engine";
import Renderer from "./CanvasRenderer";
import Options from "./Options";
import Initializer from "./Initializer";
import World from "./World";
import Recorder from "./Recorder";

let startTime = performance.now();
const pixelsPerCell = 4,
  cols = Math.ceil(window.innerWidth / pixelsPerCell),
  rows = Math.ceil(window.innerHeight / pixelsPerCell),
  renderer = new Renderer(cols, rows, pixelsPerCell, pixelsPerCell),
  options = new Options(),
  initializer = new Initializer(options, renderer),
  recorder = new Recorder(() => {
    options.model.isRecording = false;
    engine.pause();
  }),
  engine = new Engine(
    cols, //number of columns
    rows, //number of rows
    onNextState,
    30, //desired fps
    initializer,
    () => {
      if (options.model.isRecording) {
        recorder.start(options.model.recordingTime);
        recorder.addFrame(renderer.canvas);
      }
    }
  );

function onNextState(world: World, diff: any) {
  renderer.render(world, diff);
  if (options.model.isRecording) {
    recorder.addFrame(renderer.canvas);
  }
}

window.addEventListener("load", () => {
  function reset() {
    renderer.reset(options.model);
    startTime = performance.now();
    // if (options.model.isRecording) {
    //   // recorder.start(options.model.recordingTime);
    // }
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
    } else if (ev.keyCode == 83) {
      //s
      options.model.isRecording = true;
      reset();
    }
  };

  reset();
});
