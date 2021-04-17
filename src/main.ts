import { Canvas } from "./Canvas";
import { Painter } from "./Painter";

class Main {
  private readonly canvas: Canvas;
  private readonly painter: Painter;

  constructor() {
    this.canvas = new Canvas();
    this.painter = new Painter(this.canvas);
  }

  run() {
    this.painter.paint();

    document
      .querySelectorAll("#fn-red, #fn-green, #fn-blue")
      .forEach((el) =>
        el.addEventListener("input", (x: Event) =>
          this.onInputChange(x?.currentTarget as HTMLInputElement)
        )
      );
  }

  onInputChange(el: HTMLInputElement | undefined) {
    if (!el || !el.id || !el.value) {
      return;
    }
  }
}

new Main().run();
