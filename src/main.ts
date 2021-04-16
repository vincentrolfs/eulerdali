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
  }
}

new Main().run();
