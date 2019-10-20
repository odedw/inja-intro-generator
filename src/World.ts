export default class World {
  cells: Uint8Array;
  cols: number;
  rows: number;
  neighboursIndices: any;
  constructor(rows: number, cols: number, randomStart: boolean = false) {
    this.cells = new Uint8Array(new ArrayBuffer(rows * cols));
    this.cols = cols;
    this.rows = rows;
    this.neighboursIndices = new Array(cols * rows);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.neighboursIndices[this.index(i, j)] = [];
        if (i - 1 >= 0 && j - 1 >= 0)
          this.neighboursIndices[this.index(i, j)].push(
            this.index(i - 1, j - 1)
          );
        if (i - 1 >= 0)
          this.neighboursIndices[this.index(i, j)].push(this.index(i - 1, j));
        if (i - 1 >= 0 && j + 1 < cols)
          this.neighboursIndices[this.index(i, j)].push(
            this.index(i - 1, j + 1)
          );

        if (j - 1 >= 0)
          this.neighboursIndices[this.index(i, j)].push(this.index(i, j - 1));
        if (j + 1 < cols)
          this.neighboursIndices[this.index(i, j)].push(this.index(i, j + 1));

        if (i + 1 < rows && j - 1 >= 0)
          this.neighboursIndices[this.index(i, j)].push(
            this.index(i + 1, j - 1)
          );
        if (i + 1 < rows)
          this.neighboursIndices[this.index(i, j)].push(this.index(i + 1, j));
        if (i + 1 < rows && j + 1 < cols)
          this.neighboursIndices[this.index(i, j)].push(
            this.index(i + 1, j + 1)
          );
      }
    }

    if (randomStart)
      for (let i = 0; i < this.cells.length; i++)
        this.cells[i] = Math.round(Math.random());
  }

  index(i: number, j: number) {
    return i * this.cols + j;
  }
  get(i: number) {
    return i >= 0 && i < this.cells.length ? this.cells[i] : undefined;
  }

  set(i: number, val: any) {
    this.cells[i] = val;
  }

  count(a: number, b: number) {
    return a + this.cells[b];
  }

  neighbours(i: number) {
    return this.neighboursIndices[i].reduce(this.count.bind(this), 0);
  }
}
