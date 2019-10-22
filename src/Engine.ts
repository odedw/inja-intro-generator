import World from "./World";
import { Model } from "./Options";
import Initializer from "./Initializer";

export default class Engine {
  cols: number;
  rows: number;
  currentWorld: World;
  nextWorld: World;
  survivalMap = new Array(8);
  birthMap = new Array(8);
  msTillNextFrame = 0;
  lastTickTime = 0;
  isRunning = false;
  msPerFrame: number;
  onTick: any;
  birth = "";
  survival = "";
  randomStart = false;
  initializer: Initializer;
  targetFps: number;
  currentFps: number;
  encoder: any;

  constructor(
    cols: number,
    rows: number,
    onTick: any,
    desiredFps: number,
    initializer: Initializer
  ) {
    this.cols = cols;
    this.rows = rows;
    this.targetFps = desiredFps;
    this.onTick = onTick;
    this.initializer = initializer;
  }

  computeNextState(): Set<any> {
    let nextState = 0;
    const diff = new Set();
    for (let i = 0; i < this.cols * this.rows; i++) {
      let neighbors = this.currentWorld.neighbours(i),
        currentState = this.currentWorld.get(i);

      nextState =
        currentState === 1
          ? this.survivalMap[neighbors]
          : this.birthMap[neighbors];
      this.nextWorld.set(i, nextState);

      if (currentState !== nextState) {
        diff.add(i);
        const neighboursIndices = this.currentWorld.neighboursIndices[i];
        for (let j = 0; j < neighboursIndices.length; j++) {
          diff.add(neighboursIndices[j]);
        }
      }
    }
    const temp = this.currentWorld;
    this.currentWorld = this.nextWorld;
    this.nextWorld = temp;
    return diff;
  }

  tick() {
    const startTime = performance.now(),
      msElapsed = startTime - this.lastTickTime;
    this.msTillNextFrame -= msElapsed;
    if (this.msTillNextFrame <= 0) {
      const diff = this.computeNextState();
      this.onTick(this.currentWorld, diff);
      this.lastTickTime = performance.now();
      const timeForFrame = this.lastTickTime - startTime;
      if (this.currentFps < this.targetFps) {
        this.currentFps += 0.5;
        this.calculateMsPerFrame();
        // console.log(`fps: ${this.currentFps}`);
      }
      this.msTillNextFrame = this.msPerFrame - timeForFrame;
    } else {
      this.lastTickTime = performance.now();
    }

    if (this.isRunning) window.requestAnimationFrame(this.tick.bind(this));
  }

  setModel(model: Model) {
    this.birth = model.birth;
    this.survival = model.survival;
    for (let i = 0; i < 8; i++) {
      this.birthMap[i] = this.birth.indexOf(i.toString()) >= 0 ? 1 : 0;
      this.survivalMap[i] = this.survival.indexOf(i.toString()) >= 0 ? 1 : 0;
    }

    this.randomStart = model.randomStart;
  }

  calculateMsPerFrame() {
    this.msPerFrame = 1000 / this.currentFps;
  }

  start(model: Model) {
    this.isRunning = false;
    this.setModel(model);
    this.currentWorld = new World(this.rows, this.cols, this.randomStart);
    this.nextWorld = new World(this.rows, this.cols);
    this.currentFps = 20;
    this.calculateMsPerFrame();
    
    this.initializer.init(this.currentWorld).then(() => {
      this.isRunning = true;     
      window.requestAnimationFrame(this.tick.bind(this));
    });
  }

  pause() {
    this.isRunning = false;
  }

  play() {
    this.isRunning = true;
    window.requestAnimationFrame(this.tick.bind(this));
  }
}
