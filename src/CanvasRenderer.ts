import World from "./World";

export default class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  imageData: Int32Array;
  liveColor = 0xff | (0xff << 8) | (0xff << 16) | (0xff << 24);
  deadColor = 0x22 | (0x8b << 8) | (0x22 << 16) | (0xff << 24);
  colors: any;
  image: ImageData;
  model: any;

  constructor(
    cols: number,
    rows: number,
    cellWidth: number,
    cellHeight: number
  ) {
    this.cols = cols;
    this.rows = rows;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this.image = this.context.createImageData(
      this.canvas.width,
      this.canvas.height
    );
    this.imageData = new Int32Array(this.image.data.buffer);
  }

  resetData() {
    for (var i = 0; i < this.canvas.width * this.canvas.height; i++) {
      this.imageData[i] = this.deadColor;
    }
  }

  hexToRgb(hex: string) {
    const result =
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || "#000000";
    return (
      parseInt(result[1], 16) |
      (parseInt(result[2], 16) << 8) |
      (parseInt(result[3], 16) << 16) |
      (0xff << 24)
    );
  }

  fillSquare(x: number, y: number, color: number) {
    var width = this.cellWidth,
      height = this.cellHeight;

    if (x * this.cellWidth + width > this.canvas.width) {
      width = this.canvas.width - x * this.cellWidth;
    }

    if (y * this.cellHeight + height > this.canvas.height) {
      height = this.canvas.height - y * this.cellHeight;
    }

    if (width <= 0 || height <= 0) {
      return;
    }

    var pointer = x * this.cellWidth + y * this.canvas.width * this.cellHeight,
      rowWidth = this.canvas.width - width;

    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        this.imageData[pointer] = color;

        pointer++;
      }
      pointer += rowWidth;
    }
  }
  // const gif = new GIF({
  //   //   workers:10,
  //   //   quality: 10,
  //   //   workerScript: "./lib/gif.worker.js"
  //   // });
  //   var encoder = new GIFEncoder();
  //   encoder.setRepeat(1);
  //   encoder.setDelay(50); //go to next frame every n milliseconds
  //   encoder.start();
  //   let firstReset = true;
  //   let time = 0;
  render(world: World, diff: any) {
    const arr = Array.from(diff);
    for (let i = 0; i < arr.length; i++) {
      const index: any = arr[i];
      const color =
        world.cells[index] === 1
          ? this.colors[world.neighbours(index)]
          : this.deadColor;
      this.fillSquare(index % this.cols, Math.floor(index / this.cols), color);
    }
    this.context.putImageData(this.image, 0, 0);

    // encoder.addFrame(context);
    // encoder.setTransparent(0);
    // time += 50;
    // if (time >= 10000) this.reset();
    // if (time % 1000 === 0) console.log(`time is ${time}`);
  }

  reset(model: any) {
    this.resetData();
    this.colors = model.colors.map(this.hexToRgb);
    this.model = model;
    this.context.putImageData(this.image, 0, 0);

    // if (firstReset) firstReset = false;
    // else {
    // console.log("render");
    // encoder.finish();
    // encoder.download("download.gif");
    // gif.on("finished", function(blob) {
    // const blobUrl = URL.createObjectURL(blob);
    // window.location.replace(blobUrl);
    // });
    // gif.render();
    // }
  }
}
