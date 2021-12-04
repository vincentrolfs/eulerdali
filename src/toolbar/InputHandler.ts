import { Painter } from "../Painter";
import {
  ColorFunc,
  PaintInputName,
  PaintInputNames,
  PaintInputs,
  ZoomFunc,
} from "../common/utilities";
import { DEBOUNCE_TIMEOUT } from "../common/settings";

const INPUT_ID_RED = "#input-red";
const INPUT_ID_GREEN = "#input-green";
const INPUT_ID_BLUE = "#input-blue";
const INPUT_ID_ZOOM = "#input-zoom";

type InputMap = Record<keyof PaintInputs, HTMLInputElement>;

export class InputHandler {
  private readonly inputs: InputMap;
  private inputTimeout: number | undefined;

  constructor(private readonly painter: Painter) {
    this.inputs = {
      red: document.querySelector(INPUT_ID_RED)!,
      green: document.querySelector(INPUT_ID_GREEN)!,
      blue: document.querySelector(INPUT_ID_BLUE)!,
      zoom: document.querySelector(INPUT_ID_ZOOM)!,
    };

    InputHandler.registerGlobalMath();
  }

  listen() {
    this.setEventListeners();
  }

  overwrite(values: Record<PaintInputName, string>) {
    for (const key of PaintInputNames) {
      this.inputs[key].value = values[key];
    }

    this.paint();
  }

  getFormulas(): Record<PaintInputName, string> {
    return {
      red: this.inputs.red.value,
      green: this.inputs.green.value,
      blue: this.inputs.blue.value,
      zoom: this.inputs.zoom.value,
    };
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
    let success = true;

    try {
      paintInputs = this.buildPaintInputs();
    } catch (e) {
      success = false;
    }

    if (paintInputs) {
      success = success && this.painter.paint(paintInputs);
    }

    this.setSuccessState(success);
  }

  private buildPaintInputs(): PaintInputs {
    return {
      red: InputHandler.buildColorFunc(this.inputs.red.value),
      green: InputHandler.buildColorFunc(this.inputs.green.value),
      blue: InputHandler.buildColorFunc(this.inputs.blue.value),
      zoom: InputHandler.buildZoomFunc(this.inputs.zoom.value),
    };
  }

  private setSuccessState(success: boolean) {
    for (const key of PaintInputNames) {
      const classes = this.inputs[key].classList;
      success ? classes.remove("error") : classes.add("error");
    }
  }
}
