import { CANVAS_HEIGHT_RELATIVE, CANVAS_WIDTH_RELATIVE } from "./constants";

export class Canvas {
  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.element = document.getElementById("canvas") as HTMLCanvasElement;
    this.element.width = Math.round(
      document.body.clientWidth * CANVAS_WIDTH_RELATIVE
    );
    this.element.height = Math.round(
      document.body.clientHeight * CANVAS_HEIGHT_RELATIVE
    );
    this.ctx = this.element.getContext("2d")!;

    this.ctx.fillRect(0, 0, this.element.width, this.element.height);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
  }

  rect(x: number, y: number, width: number, height: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  get width() {
    return this.element.width;
  }

  get height() {
    return this.element.height;
  }
}
