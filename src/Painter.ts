import { Canvas } from "./Canvas";
import { ColorFunc, PaintInputs, ZoomFunc } from "./common/utilities";
import { Painting } from "./Painting";

export class Painter {
  constructor(private readonly canvas: Canvas) {}

  createPainting(paintInputs: PaintInputs) {
    const painting = new Painting(this.canvas);

    this.paintAllPixel(painting, paintInputs);

    return painting;
  }

  paint(paintInputs: PaintInputs) {
    let painting;

    try {
      painting = this.createPainting(paintInputs);
    } catch (e) {}

    if (painting) {
      painting.apply();
    }
  }

  private paintAllPixel(painting: Painting, paintInputs: PaintInputs) {
    const { width, height } = this.canvas;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.paintPixel(painting, x, y, paintInputs);
      }
    }
  }

  private paintPixel(
    painting: Painting,
    x: number,
    y: number,
    paintInputs: PaintInputs
  ) {
    const color = this.computeColor(x, y, paintInputs);
    painting.setPixel(x, y, color);
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
