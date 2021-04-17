import { Canvas } from "./Canvas";
import { ColorFunc } from "./utilities";

const zoom = 1 / 4;

export class Painter {
  constructor(private readonly canvas: Canvas) {}

  paint(redFunc: ColorFunc, greenFunc: ColorFunc, blueFunc: ColorFunc) {
    const { width, height } = this.canvas;

    this.canvas.startJob();

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.paintBlock(x, y, redFunc, greenFunc, blueFunc);
      }
    }

    this.canvas.endJob();
  }

  private paintBlock(
    x: number,
    y: number,
    redFunc: ColorFunc,
    greenFunc: ColorFunc,
    blueFunc: ColorFunc
  ) {
    const color = this.computeColor(x, y, redFunc, greenFunc, blueFunc);
    this.canvas.pixel(x, y, color);
  }

  private computeColor(
    xAbsolute: number,
    yAbsolute: number,
    redFunc: ColorFunc,
    greenFunc: ColorFunc,
    blueFunc: ColorFunc
  ): [number, number, number] {
    const [x, y] = this.computeRelativeCoordinates(xAbsolute, yAbsolute);
    const red = Painter.computeColorComponent(x, y, redFunc);
    const green = Painter.computeColorComponent(x, y, greenFunc);
    const blue = Painter.computeColorComponent(x, y, blueFunc);

    return [red, green, blue];
  }

  private computeRelativeCoordinates(xAbsolute: number, yAbsolute: number) {
    const scale = zoom * Math.min(this.canvas.width, this.canvas.height);

    return [
      (2 * xAbsolute - this.canvas.width) / scale,
      (2 * yAbsolute - this.canvas.height) / scale,
    ];
  }

  private static computeColorComponent(x: number, y: number, func: ColorFunc) {
    return Painter.capNumber(255 * Math.abs(Painter.getFuncResult(x, y, func)));
  }

  private static getFuncResult(x: number, y: number, func: ColorFunc) {
    try {
      return func(x, y) || 0;
    } catch {
      return 0;
    }
  }

  private static capNumber(num: number) {
    return Math.max(0, Math.min(255, Math.round(num || 0)));
  }
}
