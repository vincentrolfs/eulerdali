import { Painter } from "./Painter";
import {
  ColorFunc,
  PaintInputName,
  PaintInputNames,
  PaintInputs,
  ZoomFunc,
} from "./common/utilities";
import { DEBOUNCE_TIMEOUT } from "./common/constants";

const INPUT_ID_RED = "#input-red";
const INPUT_ID_GREEN = "#input-green";
const INPUT_ID_BLUE = "#input-blue";
const INPUT_ID_ZOOM = "#input-zoom";

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

    Parser.registerGlobalMath();
  }

  private static registerGlobalMath() {
    for (const key of Object.getOwnPropertyNames(Math)) {
      if (Math.hasOwnProperty(key) && !window.hasOwnProperty(key)) {
        // @ts-ignore
        window[key] = Math[key];
      }
    }
  }

  private static buildColorFunc(funcDescription: string): ColorFunc {
    return new Function(
      "x",
      "y",
      "t",
      `return ${funcDescription};`
    ) as ColorFunc;
  }

  private static buildZoomFunc(funcDescription: string): ZoomFunc {
    return new Function("t", `return ${funcDescription};`) as ZoomFunc;
  }

  overwrite(values: Record<PaintInputName, string>) {
    for (const key of PaintInputNames) {
      this.inputs[key].value = values[key];
    }

    this.paint();
  }

  activate() {
    this.setEventListeners();
  }

  getValues(): Record<PaintInputName, string> {
    return {
      red: this.inputs.red.value,
      green: this.inputs.green.value,
      blue: this.inputs.blue.value,
      zoom: this.inputs.zoom.value,
    };
  }

  private setEventListeners() {
    Object.values(this.inputs).forEach((el) =>
      el.addEventListener("input", (event) =>
        this.onInputChange(event.currentTarget as HTMLInputElement | null)
      )
    );
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
}
