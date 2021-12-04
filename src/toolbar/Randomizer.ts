import { RANDOMIZER_MAX_DEPTH, RANDOMIZER_MIN_DEPTH } from "../common/settings";

type NullaryOperation = (n: number) => string;
type UnaryOperation = (s: string) => string;
type BinaryOperation = (s: string, t: string) => string;

const NULLARY_OPERATIONS: NullaryOperation[] = [
  () => "x",
  () => "y",
  (n) => n.toString(),
];

const UNARY_OPERATIONS: UnaryOperation[] = [
  (s) => s,
  (s) => `exp(${s})`,
  (s) => `sin(${s})`,
  (s) => `cos(${s})`,
  (s) => `tan(${s})`,
  (s) => `sinh(${s})`,
  (s) => `cosh(${s})`,
  (s) => `tanh(${s})`,
  (s) => `abs(${s})`,
  (s) => `log(${s})`,
  (s) => `log(abs(${s}))`,
  (s) => `sqrt(${s})`,
  (s) => `sqrt(abs(${s}))`,
  (s) => `1/(${s})`,
  (s) => `(${s})**2`,
  (s) => `(${s})**3`,
  // (s) => `(${s})**4`,
  // (s) => `(${s})**5`,
  // (s) => `floor(${s})`,
  // (s) => `round(${s})`,
  // (s) => `sign(${s})`,
];

const BINARY_OPERATIONS: BinaryOperation[] = [
  (s, t) => `(${s})+(${t})`,
  (s, t) => `(${s})*(${t})`,
  (s, t) => `(${s})-(${t})`,
  (s, t) => `(${s})/(${t})`,
  // (s, t) => `pow(${s},${t})`,
  // (s, t) => `max(${s},${t})`,
  // (s, t) => `min(${s},${t})`,
];

export class Randomizer {
  randomFunc(): string {
    const targetDepth = this.randInt(
      RANDOMIZER_MIN_DEPTH,
      RANDOMIZER_MAX_DEPTH
    );

    return this.createSubFunc(1, targetDepth);
  }

  randomZoom(): string {
    return `1/${this.randInt(1, 10)}`;
  }

  private createSubFunc(currentDepth: number, targetDepth: number): string {
    if (currentDepth === targetDepth) {
      return this.nullaryOperation();
    }

    const arity = this.randInt(1, 2);

    if (arity === 1) {
      return this.unaryOperation(
        this.createSubFunc(currentDepth + 1, targetDepth)
      );
    }

    const secondTargetDepth = this.randInt(currentDepth + 1, targetDepth);
    const decider = this.randInt(0, 1);
    const targetDepth0 = decider === 0 ? targetDepth : secondTargetDepth;
    const targetDepth1 = decider === 1 ? targetDepth : secondTargetDepth;

    return this.binaryOperation(
      this.createSubFunc(currentDepth + 1, targetDepth0),
      this.createSubFunc(currentDepth + 1, targetDepth1)
    );
  }

  private nullaryOperation(): string {
    const n = this.randInt(-5, 5);
    const operation = this.sample(NULLARY_OPERATIONS);

    return operation(n);
  }

  private unaryOperation(s: string): string {
    const operation = this.sample(UNARY_OPERATIONS);

    return operation(s);
  }

  private binaryOperation(s: string, t: string): string {
    const operation = this.sample(BINARY_OPERATIONS);

    return operation(s, t);
  }

  private sample<T>(array: T[]): T {
    return array[this.randInt(0, array.length - 1)];
  }

  private randInt(
    minInclusive: number,
    maxInclusive: number,
    skew: number = 1
  ) {
    return Math.round(this.randFloat(minInclusive, maxInclusive, skew));
  }

  private randFloat(
    minInclusive: number,
    maxInclusive: number,
    skew: number = 1
  ) {
    return (maxInclusive - minInclusive) * Math.random() ** skew + minInclusive;
  }
}
