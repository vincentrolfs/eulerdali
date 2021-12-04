import { Canvas } from "./Canvas";
import { Painter } from "./Painter";
import { Parser } from "./toolbar/Parser";
import { Toolbar } from "./toolbar/Toolbar";

class Main {
  private readonly canvas: Canvas;
  private readonly painter: Painter;
  private readonly toolbar: Toolbar;

  constructor() {
    this.canvas = new Canvas();
    this.painter = new Painter(this.canvas);
    this.toolbar = new Toolbar(this.painter);
  }

  run() {
    this.toolbar.activate();
  }
}

window.onload = () => new Main().run();
