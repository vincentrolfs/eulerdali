const CANVAS_ID = "canvas";

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

  putImageData(imageData: ImageData) {
    this.ctx.putImageData(imageData, 0, 0);
  }
}
