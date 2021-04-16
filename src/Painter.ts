import { Canvas } from "./Canvas";

const func3 = function (x, y) {
  return Math.sin(1 / Math.log(Math.cos(x) + 1 / Math.tan(y)));
};

const func2 = function (x, y) {
  return Math.cos(1 / Math.log(Math.tan(x) + 1 / Math.sin(y)));
};

const func1 = function (x, y) {
  return Math.tan(1 / Math.log(Math.sin(x) + 1 / Math.cos(y)));
};

const zoom = 1 / 4;

type ComponentFunction = (x: number, y: number) => number;

export class Painter {
  constructor(private readonly canvas: Canvas) {}

  paint() {
    const { width, height } = this.canvas;

    this.canvas.startJob();

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.paintBlock(x, y);
      }
    }

    this.canvas.endJob();
  }

  private paintBlock(x: number, y: number) {
    const color = this.computeColor(x, y);
    this.canvas.pixel(x, y, color);
  }

  private computeColor(
    xAbsolute: number,
    yAbsolute: number
  ): [number, number, number] {
    const [x, y] = this.computeRelativeCoordinates(xAbsolute, yAbsolute);
    const red = Painter.computeColorComponent(x, y, func1);
    const green = Painter.computeColorComponent(x, y, func2);
    const blue = Painter.computeColorComponent(x, y, func3);

    return [red, green, blue];
  }

  private computeRelativeCoordinates(xAbsolute: number, yAbsolute: number) {
    const scale = zoom * Math.min(this.canvas.width, this.canvas.height);

    return [
      (2 * xAbsolute - this.canvas.width) / scale,
      (2 * yAbsolute - this.canvas.height) / scale,
    ];
  }

  private static computeColorComponent(
    x: number,
    y: number,
    func: ComponentFunction
  ) {
    return Painter.capNumber(255 * Math.abs(func(x, y)));
  }

  private static computeColorComponent2(
    x: number,
    y: number,
    func: ComponentFunction
  ) {
    return Painter.capNumber(255 * ((func(x, y) + 1) / 2));
  }

  private static capNumber(num: number) {
    return Math.max(0, Math.min(255, Math.round(num || 0)));
  }
}
