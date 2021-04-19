import { Painter } from "./Painter";
import { ColorFunc, PaintInputs, ZoomFunc } from "./utilities";
import { DEBOUNCE_TIMEOUT } from "./constants";
import { examples, initialExample } from "./examples";

const INPUT_ID_RED = "#input-red";
const INPUT_ID_GREEN = "#input-green";
const INPUT_ID_BLUE = "#input-blue";
const INPUT_ID_ZOOM = "#input-zoom";
const BUTTON_ID_RANDOM = "#button-random";

type InputMap = Record<keyof PaintInputs, HTMLInputElement>;

export class Parser {
  private readonly inputs: InputMap;
  private inputTimeout: number | undefined;

  constructor(private readonly painter: Painter) {
    this.inputs = {
      red: document.querySelector(INPUT_ID_RED)!,
      green: document.querySelector(INPUT_ID_GREEN)!,
      blue: document.querySelector(INPUT_ID_BLUE)!,
      zoom: document.querySelector(INPUT_ID_ZOOM)!,
    };
  }

  parse() {
    Parser.registerGlobalMath();
    this.setEventListeners();
    this.setExample(initialExample);
  }

  private setEventListeners() {
    Object.values(this.inputs).forEach((el) =>
      el.addEventListener("input", (x) =>
        this.onInputChange(x.currentTarget as HTMLInputElement | null)
      )
    );

    document
      .querySelector(BUTTON_ID_RANDOM)!
      .addEventListener("click", () => this.setExample());
  }

  private static registerGlobalMath() {
    for (const key of Object.getOwnPropertyNames(Math)) {
      if (Math.hasOwnProperty(key) && !window.hasOwnProperty(key)) {
        // @ts-ignore
        window[key] = Math[key];
      }
    }
  }

  private onInputChange(el: HTMLInputElement | null) {
    if (this.inputTimeout !== undefined) {
      clearTimeout(this.inputTimeout);
    }

    this.inputTimeout = setTimeout(() => {
      if (!el || !el.id || !el.value) {
        return;
      }

      this.paint();
    }, DEBOUNCE_TIMEOUT);
  }

  private setExample(index?: number) {
    const randomMode = index === undefined;
    if (randomMode) {
      index = Math.floor(Math.random() * examples.length);
    }
    const example = examples[index!];
    let somethingChanged = false;

    for (const key of Object.keys(example) as (keyof PaintInputs)[]) {
      somethingChanged =
        somethingChanged || this.inputs[key].value !== example[key];
      this.inputs[key].value = example[key];
    }

    if (somethingChanged || !randomMode) {
      this.paint();
    } else {
      this.setExample();
    }
  }

  private paint() {
    let paintInputs;

    try {
      paintInputs = this.buildPaintInputs();
    } catch (e) {
      console.error(e);
    }

    if (paintInputs) {
      this.painter.paint(paintInputs);
    }
  }

  private buildPaintInputs(): PaintInputs {
    return {
      red: Parser.buildColorFunc(this.inputs.red.value),
      green: Parser.buildColorFunc(this.inputs.green.value),
      blue: Parser.buildColorFunc(this.inputs.blue.value),
      zoom: Parser.buildZoomFunc(this.inputs.zoom.value),
    };
  }

  private static buildColorFunc(funcDescription: string): ColorFunc {
    return new Function("x", "y", `return ${funcDescription};`) as ColorFunc;
  }

  private static buildZoomFunc(funcDescription: string): ZoomFunc {
    return new Function(`return ${funcDescription};`) as ZoomFunc;
  }
}
