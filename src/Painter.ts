import { Canvas } from "./Canvas";
import { ColorFunc, PaintInputs, ZoomFunc } from "./common/utilities";
import { Painting } from "./Painting";

export class Painter {
  constructor(private readonly canvas: Canvas) {}

  createPainting(paintInputs: PaintInputs, t: number = 0) {
    const painting = new Painting(this.canvas);

    this.paintAllPixel(painting, paintInputs, t);

    return painting;
  }

  paint(paintInputs: PaintInputs) {
    let painting;

    try {
      painting = this.createPainting(paintInputs);
    } catch (e) {
      return false;
    }

    if (painting) {
      painting.apply();
    }

    return true;
  }

  private paintAllPixel(
    painting: Painting,
    paintInputs: PaintInputs,
    t: number
  ) {
    const { width, height } = this.canvas;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.paintPixel(painting, x, y, t, paintInputs);
      }
    }
  }

  private paintPixel(
    painting: Painting,
    x: number,
    y: number,
    t: number,
    paintInputs: PaintInputs
  ) {
    const color = this.computeColor(x, y, t, paintInputs);
    painting.setPixel(x, y, color);
  }

  private computeColor(
    xAbsolute: number,
    yAbsolute: number,
    t: number,
    paintInputs: PaintInputs
  ): [number, number, number] {
    const [x, y] = this.computeRelativeCoordinates(
      xAbsolute,
      yAbsolute,
      t,
      paintInputs.zoom
    );
    const red = Painter.computeColorComponent(x, y, t, paintInputs.red);
    const green = Painter.computeColorComponent(x, y, t, paintInputs.green);
    const blue = Painter.computeColorComponent(x, y, t, paintInputs.blue);

    return [red, green, blue];
  }

  private computeRelativeCoordinates(
    xAbsolute: number,
    yAbsolute: number,
    t: number,
    zoom: ZoomFunc
  ) {
    const scale = zoom(t) * Math.min(this.canvas.width, this.canvas.height);

    return [
      (2 * xAbsolute - this.canvas.width) / scale,
      (2 * yAbsolute - this.canvas.height) / scale,
    ];
  }

  private static computeColorComponent(
    x: number,
    y: number,
    t: number,
    func: ColorFunc
  ) {
    return Painter.capNumber(
      255 * Math.abs(Painter.getFuncResult(x, y, t, func))
    );
  }

  private static getFuncResult(
    x: number,
    y: number,
    t: number,
    func: ColorFunc
  ) {
    return func(x, y, t) || 0;
  }

  private static capNumber(num: number) {
    return Math.max(0, Math.min(255, Math.round(num || 0)));
  }
}
