import { Debouncer } from "./common/Debouncer";

const CANVAS_ID = "canvas";

export class Canvas {
  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private onResize: (() => void) | undefined;
  private debouncer: Debouncer;

  constructor() {
    this.element = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
    this.ctx = this.initialize();
    this.debouncer = new Debouncer();

    window.addEventListener("resize", () =>
      this.debouncer.fire(() => {
        this.element.width = this.element.height = 0;
        this.initialize();
        this.onResize && this.onResize();
      })
    );
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

  registerOnResize<T>(onResize: () => T): T {
    this.onResize = onResize;
    return onResize();
  }

  private initialize() {
    this.element.width = document.body.clientWidth;
    this.element.height = document.body.clientHeight;

    this.ctx = this.element.getContext("2d")!;
    this.ctx.fillRect(0, 0, this.element.width, this.element.height);

    return this.ctx;
  }
}
