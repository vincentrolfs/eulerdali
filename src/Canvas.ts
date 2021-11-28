import { CANVAS_ID } from "./common/constants";

export class Canvas {
  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pendingImageData: ImageData | undefined;

  constructor() {
    this.element = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
    this.element.width = document.body.clientWidth;
    this.element.height = document.body.clientHeight;

    this.ctx = this.element.getContext("2d")!;
    this.ctx.fillRect(0, 0, this.element.width, this.element.height);
  }

  get width() {
    return this.element.width;
  }

  get height() {
    return this.element.height;
  }

  setPixel(
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
    this.pendingImageData = this.ctx.getImageData(
      0,
      0,
      this.element.width,
      this.element.height
    );
  }

  abortJob() {
    if (!this.pendingImageData) {
      throw new Error("abortJob called, but no job has been started.");
    }
    this.pendingImageData = undefined;
  }

  endJob() {
    if (!this.pendingImageData) {
      throw new Error("endJob called, but no job has been started.");
    }
    this.ctx.putImageData(this.pendingImageData, 0, 0);
    this.pendingImageData = undefined;
  }
}
