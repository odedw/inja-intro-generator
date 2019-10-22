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
          ctx.font = `bold 100px ${font}`;
          ctx.strokeStyle = "white";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            this.options.model.title,
            canvas.width / 2,
            canvas.height / 2
          );
          ctx.beginPath();
          ctx.moveTo(0, 40);
          ctx.lineTo(canvas.width, 40);
          ctx.moveTo(0, 50);
          ctx.lineTo(canvas.width, 50);
          ctx.moveTo(0, 220);
          ctx.lineTo(canvas.width, 220);
          ctx.moveTo(0, 230);
          ctx.lineTo(canvas.width, 230);
          ctx.stroke();

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
  lastIndex: number;
  world: World;
  resolve: any;
  first = true;
  init(world: World): Promise<void> {
    return new Promise((resolve, reject) => {
      this.initPromise.then(() => {
        for (let index = 0; index < this.diff.length; index++) {
          world.set(this.diff[index], 1);
        }
        this.renderer.reset(this.options.model);
        setImmediate(() => {
          this.renderer.reset(this.options.model);
          console.log("reset");
          setTimeout(() => {
            // if (this.first) {
            this.renderer.render(world, this.diff);
            console.log("render");
            // this.first = false;
            setTimeout(() => {
              console.log("resolve");
              resolve();
            }, 1000);
            // }
          }, 0);
        });

        // this.diff.sort(() => Math.random() - 0.5);
        // this.resolve = resolve;
        // this.world = world;
        // this.lastIndex = 0;

        // requestAnimationFrame(this.tick.bind(this));
      });
    });
  }
  // tick() {
  //   if (this.lastIndex === this.diff.length) {
  //     this.resolve();
  //     return;
  //   }

  //   this.world.set(this.diff[this.lastIndex], 1);
  //   this.renderer.render(this.world, [this.diff[this.lastIndex]]);
  //   this.lastIndex++;
  //   requestAnimationFrame(this.tick.bind(this));
  // }
}
