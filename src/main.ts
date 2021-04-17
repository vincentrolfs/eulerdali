import { Canvas } from "./Canvas";
import { Painter } from "./Painter";
import { Parser } from "./Parser";

class Main {
  private readonly canvas: Canvas;
  private readonly painter: Painter;
  private readonly parser: Parser;

  constructor() {
    this.canvas = new Canvas();
    this.painter = new Painter(this.canvas);
    this.parser = new Parser(this.painter);
  }

  run() {
    this.parser.parse();
  }
}

new Main().run();
