import { CANVAS_HEIGHT_RELATIVE, CANVAS_WIDTH_RELATIVE } from "./constants";

export class Canvas {
  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pendingImageData: ImageData | undefined;

  constructor() {
    this.element = document.getElementById("canvas") as HTMLCanvasElement;
    this.element.width = Math.floor(
      document.body.clientWidth * CANVAS_WIDTH_RELATIVE
    );
    this.element.height = Math.floor(
      document.body.clientHeight * CANVAS_HEIGHT_RELATIVE
    );
    this.ctx = this.element.getContext("2d")!;

    this.ctx.fillRect(0, 0, this.element.width, this.element.height);
  }

  pixel(
    x: number,
    y: number,
    color: [red: number, green: number, blue: number]
  ) {
    if (!this.pendingImageData) {
      throw new Error("No job has been started.");
    }

    const redIndex = y * (this.element.width * 4) + x * 4;
    const greenIndex = redIndex + 1;
    const blueIndex = redIndex + 2;
    const alphaIndex = redIndex + 3;
    const [red, green, blue] = color;

    this.pendingImageData.data[redIndex] = red;
    this.pendingImageData.data[greenIndex] = green;
    this.pendingImageData.data[blueIndex] = blue;
    this.pendingImageData.data[alphaIndex] = 255;
  }

  startJob() {
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    this.pendingImageData = this.ctx.getImageData(
      0,
      0,
      this.element.width,
      this.element.height
    );
  }

  endJob() {
    if (!this.pendingImageData) {
      throw new Error("No job has been started.");
    }
    this.ctx.putImageData(this.pendingImageData, 0, 0);
    this.pendingImageData = undefined;
  }

  get width() {
    return this.element.width;
  }

  get height() {
    return this.element.height;
  }
}
