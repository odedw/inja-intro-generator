import "./styles.css";
import Engine from "./Engine";
import Renderer from "./CanvasRenderer";
import Options from "./Options";
import Initializer from "./Initializer";

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
    renderer.render.bind(renderer), //onTick
    30, //desired fps
    initializer
  );

window.addEventListener("load", () => {
  function reset() {
    renderer.reset(options.model);
    engine.start(options.model);
  }
  document.onkeydown = ev => {
    if (ev.keyCode == 32) {
      //space
      let startTime = performance.now();
      reset();
    } else if (ev.keyCode == 82) {
      //r
      options.randomRules();
      let startTime = performance.now();
      reset();
    } else if (ev.keyCode == 67) {
      //c
      options.model.recordTime = Math.round(performance.now() - startTime);
      console.log(options.model.recordTime);
    } else if (ev.keyCode == 83) {
      //s
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
