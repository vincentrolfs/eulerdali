import { Canvas } from "./Canvas";
import { ColorFunc, PaintInputs, ZoomFunc } from "./utilities";

export class Painter {
  constructor(private readonly canvas: Canvas) {}

  paint(paintInputs: PaintInputs) {
    const { width, height } = this.canvas;

    this.canvas.startJob();

    try {
      this.paintAllBlocks(width, height, paintInputs);
    } catch (e) {
      console.log(e);
      this.canvas.abortJob();
    }

    this.canvas.endJob();
  }

  private paintAllBlocks(
    width: number,
    height: number,
    paintInputs: PaintInputs
  ) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.paintBlock(x, y, paintInputs);
      }
    }
  }

  private paintBlock(x: number, y: number, paintInputs: PaintInputs) {
    const color = this.computeColor(x, y, paintInputs);
    this.canvas.setPixel(x, y, color);
  }

  private computeColor(
    xAbsolute: number,
    yAbsolute: number,
    paintInputs: PaintInputs
  ): [number, number, number] {
    const [x, y] = this.computeRelativeCoordinates(
      xAbsolute,
      yAbsolute,
      paintInputs.zoom
    );
    const red = Painter.computeColorComponent(x, y, paintInputs.red);
    const green = Painter.computeColorComponent(x, y, paintInputs.green);
    const blue = Painter.computeColorComponent(x, y, paintInputs.blue);

    return [red, green, blue];
  }

  private computeRelativeCoordinates(
    xAbsolute: number,
    yAbsolute: number,
    zoom: ZoomFunc
  ) {
    const scale = zoom() * Math.min(this.canvas.width, this.canvas.height);

    return [
      (2 * xAbsolute - this.canvas.width) / scale,
      (2 * yAbsolute - this.canvas.height) / scale,
    ];
  }

  private static computeColorComponent(x: number, y: number, func: ColorFunc) {
    return Painter.capNumber(255 * Math.abs(Painter.getFuncResult(x, y, func)));
  }

  private static getFuncResult(x: number, y: number, func: ColorFunc) {
    return func(x, y) || 0;
  }

  private static capNumber(num: number) {
    return Math.max(0, Math.min(255, Math.round(num || 0)));
  }
}
