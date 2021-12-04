import { InputHandler } from "./InputHandler";
import { examples, initialExample } from "./examples";
import { Randomizer } from "./Randomizer";
import { PaintInputNames } from "../common/utilities";
import { Painter } from "../Painter";
import { Animator } from "./Animator";

const TOOLBAR_ID = "toolbar";
const EXAMPLES_ID = "examples";

const BUTTON_ID_RANDOM = "button-random";
const BUTTON_ID_HELP = "button-help";
const BUTTON_ID_SHARE = "button-share";
const BUTTON_ID_CLOSE_TOOLBAR = "button-close";
const BUTTON_ID_OPEN_TOOLBAR = "button-open";

const TOOLBAR_CLOSED_CLASS = "closed";

const HELP_URL = "https://github.com/vincentrolfs/eulerdali#readme";

export class Toolbar {
  private readonly randomizer: Randomizer;
  private readonly inputHandler: InputHandler;
  private readonly animator: Animator;

  constructor(private readonly painter: Painter) {
    this.randomizer = new Randomizer();
    this.inputHandler = new InputHandler(painter);
    this.animator = new Animator(painter);

    this.showExampleOptions();
  }

  activate() {
    this.setEventListeners();
    this.inputHandler.setEventListeners();
  }

  private showExampleOptions() {
    document.getElementById(EXAMPLES_ID)!.innerHTML += examples
      .map(
        (example, index) => `<option value="${index}">${example.name}</option>`
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
      .getElementById(BUTTON_ID_RANDOM)!
      .addEventListener("click", () => this.setRandom());

    document
      .getElementById(BUTTON_ID_SHARE)!
      .addEventListener("click", () => this.share());

    document
      .getElementById(BUTTON_ID_HELP)!
      .addEventListener("click", () => window.open(HELP_URL, "_blank"));

    document
      .getElementById(BUTTON_ID_CLOSE_TOOLBAR)!
      .addEventListener("click", () =>
        document.getElementById(TOOLBAR_ID)!.classList.add(TOOLBAR_CLOSED_CLASS)
      );
    document
      .getElementById(BUTTON_ID_OPEN_TOOLBAR)!
      .addEventListener("click", () =>
        document
          .getElementById(TOOLBAR_ID)!
          .classList.remove(TOOLBAR_CLOSED_CLASS)
      );
  }

  private setExample(exampleNumber: number) {
    this.inputHandler.overwrite(examples[exampleNumber]);
  }

  private setRandom() {
    this.inputHandler.overwrite({
      red: this.randomizer.randomFunc(),
      green: this.randomizer.randomFunc(),
      blue: this.randomizer.randomFunc(),
      zoom: this.randomizer.randomZoom(),
    });
  }

  private share() {
    const url = this.getSharingUrl();

    if (navigator && navigator.share) {
      return void navigator
        .share({ title: "Eulerdali artwork", url })
        .then(() => void 0);
    }

    return void window.prompt("Please copy the URL to share your art:", url);
  }

  private getSharingUrl() {
    const baseUrl =
      location.protocol + "//" + location.host + location.pathname + "?";
    const formulas = this.inputHandler.getFormulas();
    const encodedFormulas = [];

    for (const key of PaintInputNames) {
      encodedFormulas.push(`${key}=${encodeURIComponent(formulas[key])}`);
    }

    return baseUrl + encodedFormulas.join("&");
  }
}
