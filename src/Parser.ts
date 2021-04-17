import { Painter } from "./Painter";
import { ColorFunc } from "./utilities";
import { DEBOUNCE_TIMEOUT } from "./constants";

export class Parser {
  private readonly inputs: NodeListOf<HTMLInputElement>;
  private inputTimeout: number | undefined;

  constructor(private readonly painter: Painter) {
    this.inputs = document.querySelectorAll("#fn-red, #fn-green, #fn-blue");
  }

  parse() {
    this.registerGlobalMath();
    this.inputs.forEach((el) =>
      el.addEventListener("input", (x) =>
        this.onInputChange(x?.currentTarget as HTMLInputElement)
      )
    );
    this.paint();
  }

  registerGlobalMath() {
    for (const key of Object.getOwnPropertyNames(Math)) {
      if (Math.hasOwnProperty(key) && !window.hasOwnProperty(key)) {
        // @ts-ignore
        window[key] = Math[key];
      }
    }
  }

  private onInputChange(el: HTMLInputElement | undefined) {
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
    try {
      const [redFunc, greenFunc, blueFunc] = this.buildAllFuncs();
      this.painter.paint(redFunc, greenFunc, blueFunc);
    } catch {}
  }

  private buildAllFuncs() {
    const funcs: ColorFunc[] = [];
    this.inputs.forEach((el) => funcs.push(Parser.buildFunc(el.value)));

    return funcs;
  }

  private static buildFunc(funcDescription: string): ColorFunc {
    return new Function("x", "y", `return ${funcDescription};`) as ColorFunc;
  }
}
