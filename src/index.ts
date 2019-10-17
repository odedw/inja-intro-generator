import "./styles.css";
import Engine from "./Engine";
import Renderer from "./CanvasRenderer";

const pixelsPerCell = 4,
  cols = Math.ceil(window.innerWidth / pixelsPerCell),
  rows = Math.ceil(window.innerHeight / pixelsPerCell),
  renderer = new Renderer(cols, rows, pixelsPerCell, pixelsPerCell),
  engine = new Engine(
    cols, //number of columns
    rows, //number of rows
    renderer.render.bind(renderer), //onTick
    30 //desired fps
  );
// renderer.onDraw = engine.onDraw;
let first = true;
window.addEventListener("load", () => {
  // mixpanel.track("View");
  // const gui = new dat.GUI();
  // const options = new Options(
  //   gui,
  //   model => {
  //     renderer.reset(model);
  //     if (first) {
  //       engine.start(model);
  //       first = false;
  //     } else {
  //       engine.pause();
  //     }
  //   },
  //   engine.pause,
  //   engine.play
  // );
  // options.methods.reset();
  const model = {
    birth: "3",
    survival: "23",
    randomStart: true,
    colors: [
      "#FFFFFF",
      "#FFFFFF",
      "#FFFFFF",
      "#FFFFFF",
      "#FFFFFF",
      "#FFFFFF",
      "#FFFFFF",
      "#FFFFFF",
      "#FFFFFF"
    ],
    visible: true
    // renderCenter: false
  };
  renderer.reset(model);
  if (first) {
    engine.start(model);
    first = false;
  } else {
    engine.pause();
  }
});
