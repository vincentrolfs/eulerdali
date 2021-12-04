import { DEBOUNCE_TIMEOUT } from "./settings";

export class Debouncer {
  private inputTimeout: number | undefined;

  fire(handler: () => void) {
    if (this.inputTimeout !== undefined) {
      clearTimeout(this.inputTimeout);
    }

    this.inputTimeout = setTimeout(handler, DEBOUNCE_TIMEOUT);
  }
}
