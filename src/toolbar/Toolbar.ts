import { Parser } from "../Parser";
import { EXAMPLES_ID } from "../common/constants";
import { examples, initialExample } from "./examples";
import { Randomizer } from "./Randomizer";

const BUTTON_ID_RANDOM = "#button-random";

export class Toolbar {
  private readonly randomizer: Randomizer;

  constructor(private readonly parser: Parser) {
    this.randomizer = new Randomizer();
  }

  activate() {
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
        console.log("click");
        console.log(
          parseInt((event.currentTarget as HTMLAnchorElement).innerText) - 1
        );
        this.setExample(
          parseInt((event.currentTarget as HTMLAnchorElement).innerText) - 1
        );
      })
    );

    document
      .querySelector(BUTTON_ID_RANDOM)!
      .addEventListener("click", () => this.setRandom());
  }

  private setExample(exampleNumber: number) {
    this.parser.overwrite(examples[exampleNumber]);
  }

  private setRandom() {
    this.parser.overwrite({
      red: this.randomizer.randomFunc(),
      green: this.randomizer.randomFunc(),
      blue: this.randomizer.randomFunc(),
      zoom: this.randomizer.randomZoom(),
    });
  }
}
