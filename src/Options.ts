import * as dat from "dat.gui";

export type Model = {
  birth: string;
  survival: string;
  randomStart: boolean;
  title: string;
  subtitle?: string;
  colors: string[];
};

export default class Options {
  model: Model = {
    birth: "3",
    survival: "23",
    randomStart: false,
    title: "inja",
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
    ]
  };
  constructor() {
    const gui = new dat.GUI();
    const rulesFolder = gui.addFolder("rules");
    rulesFolder.add(this.model, "birth").listen();
    rulesFolder.add(this.model, "survival").listen();
    rulesFolder.add(this, "randomRules").name("random");

    gui.add(this.model, "title");
    gui.closed = true;
  }

  randomRules() {
    const chanceB = Math.random();
    do {
      this.model.birth = [1, 2, 3, 4, 5, 6, 7, 8]
        .filter(i => Math.random() > chanceB)
        .join()
        .replace(/,/g, "");
    } while (!this.model.birth);
    const chanceS = Math.random();
    do {
      this.model.survival = [1, 2, 3, 4, 5, 6, 7, 8]
        .filter(i => Math.random() > chanceS)
        .join()
        .replace(/,/g, "");
    } while (!this.model.survival);
  }
}
