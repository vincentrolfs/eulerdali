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
    document.getElementById(EXAMPLES_ID)!.innerHTML =
      `<option value="-1">&gt; Display example</option>` +
      examples
        .map(
          (example, index) =>
            `<option value="${index}">${example.name}</option>`
        )
        .join(", ");
  }

  private setEventListeners() {
    document
      .getElementById(EXAMPLES_ID)!
      .addEventListener("change", (event) => {
        const target = event.target as HTMLSelectElement | undefined;
        const value = target?.value;

        if (target === undefined || value === undefined || value === "-1") {
          return;
        }

        this.setExample(parseInt(value));
        target.value = "-1";
      });

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
