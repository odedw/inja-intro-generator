import "./styles.css";
import Engine from "./Engine";
import Renderer from "./CanvasRenderer";
import Options from "./Options";

const pixelsPerCell = 5,
  cols = Math.ceil(window.innerWidth / pixelsPerCell),
  rows = Math.ceil(window.innerHeight / pixelsPerCell),
  renderer = new Renderer(cols, rows, pixelsPerCell, pixelsPerCell),
  engine = new Engine(
    cols, //number of columns
    rows, //number of rows
    renderer.render.bind(renderer), //onTick
    30 //desired fps
  );

window.addEventListener("load", () => {
  const options = new Options();
  function reset() {
    renderer.reset(options.model);
    engine.start(options.model);
  }
  document.onkeydown = ev => {
    if (ev.keyCode == 32) {
      //space
      reset();
    } else if (ev.keyCode == 82) {
      //r
      options.randomRules();
      reset();
    } //else if (ev.keyCode == 67) {
    //   //c
    //   this.methods.random();
    // } else if (ev.keyCode == 66) {
    //   //c
    //   this.methods.randomRules();
    // } else if (ev.keyCode == 68) {
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
