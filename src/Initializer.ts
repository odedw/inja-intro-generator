import World from "./World";
import Renderer from "./CanvasRenderer";
import Options from "./Options";

declare global {
  interface Window {
    WebFont: any;
  }
}

export default class Initializer {
  options: Options;
  renderer: Renderer;
  diff: number[];
  initPromise: Promise<void>;

  constructor(options: Options, renderer: Renderer) {
    this.options = options;
    this.renderer = renderer;
    const font = "Megrim";
    this.initPromise = new Promise((resolve, reject) => {
      window.WebFont.load({
        google: {
          families: [font]
        },
        active: () => {
          const canvas = document.getElementById(
            "init-canvas"
          ) as HTMLCanvasElement;
          canvas.style.letterSpacing = "10px";
          const ctx = canvas.getContext("2d");
          ctx.font = `bold 80px ${font}`;
          ctx.strokeStyle = "black";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            this.options.model.title,
            canvas.width / 2,
            canvas.height / 2
          );
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          this.diff = [];
          for (let index = 0; index < imageData.data.length / 4; index++) {
            const element = imageData.data[index * 4];
            if (element !== 0) {
              this.diff.push(index);
            }
          }
          resolve();
        }
      });
    });
  }
  init(world: World): Promise<void> {
    return new Promise((resolve, reject) => {
      this.initPromise.then(() => {
        for (let index = 0; index < this.diff.length; index++) {
          world.set(this.diff[index], 1);
        }

        this.renderer.render(world, this.diff);
        resolve();
      });
    });
  }
}
