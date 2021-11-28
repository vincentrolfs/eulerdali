import { Canvas } from "./Canvas";
import { Painter } from "./Painter";
import { Parser } from "./Parser";
import { Toolbar } from "./toolbar/Toolbar";

class Main {
  private readonly canvas: Canvas;
  private readonly painter: Painter;
  private readonly parser: Parser;
  private readonly toolbar: Toolbar;

  constructor() {
    this.canvas = new Canvas();
    this.painter = new Painter(this.canvas);
    this.parser = new Parser(this.painter);
    this.toolbar = new Toolbar(this.parser);
  }

  run() {
    this.parser.activate();
    this.toolbar.activate();
  }
}

window.onload = () => new Main().run();
