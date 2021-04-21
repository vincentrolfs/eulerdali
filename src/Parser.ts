import { Painter } from "./Painter";
import { ColorFunc, PaintInputNames, PaintInputs, ZoomFunc } from "./utilities";
import { DEBOUNCE_TIMEOUT, EXAMPLES_ID } from "./constants";
import { examples, initialExample } from "./examples";
import { Randomizer } from "./Randomizer";

const INPUT_ID_RED = "#input-red";
const INPUT_ID_GREEN = "#input-green";
const INPUT_ID_BLUE = "#input-blue";
const INPUT_ID_ZOOM = "#input-zoom";
const BUTTON_ID_RANDOM = "#button-random";

type InputMap = Record<keyof PaintInputs, HTMLInputElement>;

export class Parser {
  private readonly inputs: InputMap;
  private inputTimeout: number | undefined;
  private readonly randomizer: Randomizer;

  constructor(private readonly painter: Painter) {
    this.inputs = {
      red: document.querySelector(INPUT_ID_RED)!,
      green: document.querySelector(INPUT_ID_GREEN)!,
      blue: document.querySelector(INPUT_ID_BLUE)!,
      zoom: document.querySelector(INPUT_ID_ZOOM)!,
    };

    this.randomizer = new Randomizer();
  }

  parse() {
    Parser.registerGlobalMath();
    this.showExampleOptions();
    this.setEventListeners();
    this.setExample(initialExample);
  }

  private showExampleOptions() {
    document.getElementById(EXAMPLES_ID)!.innerHTML = examples
      .map((_, index) => `<a href="#">${index + 1}</a>`)
      .join(", ");
  }

  private setEventListeners() {
    document.querySelectorAll(`#${EXAMPLES_ID} a`).forEach((el) =>
      el.addEventListener("click", (event) => {
        event.preventDefault();
        this.setExample(
          parseInt((event.currentTarget as HTMLAnchorElement).innerText) - 1
        );
      })
    );

    Object.values(this.inputs).forEach((el) =>
      el.addEventListener("input", (event) =>
        this.onInputChange(event.currentTarget as HTMLInputElement | null)
      )
    );

    document
      .querySelector(BUTTON_ID_RANDOM)!
      .addEventListener("click", () => this.setRandom());
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

  private setRandom() {
    for (const key of PaintInputNames) {
      this.inputs[key].value =
        key === "zoom"
          ? this.randomizer.randomZoom()
          : this.randomizer.randomFunc();
    }

    this.paint();
  }

  private setExample(exampleNumber: number) {
    const example = examples[exampleNumber];

    for (const key of PaintInputNames) {
      this.inputs[key].value = example[key];
    }

    this.paint();
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
