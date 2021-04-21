import { RANDOMIZER_MAX_DEPTH } from "./constants";

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
    return this.createSubFunc(1);
  }

  randomZoom(): string {
    return `1/${this.randInt(1, 10)}`;
  }

  private createSubFunc(currentDepth: number): string {
    const arity = this.randInt(0, 2);

    if (RANDOMIZER_MAX_DEPTH === currentDepth || arity === 0) {
      return this.nullaryOperation();
    } else if (arity === 1) {
      return this.unaryOperation(this.createSubFunc(currentDepth + 1));
    } else {
      return this.binaryOperation(
        this.createSubFunc(currentDepth + 1),
        this.createSubFunc(currentDepth + 1)
      );
    }
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

  private randInt(minInclusive: number, maxInclusive: number) {
    return Math.round(this.randFloat(minInclusive, maxInclusive));
  }

  private randFloat(minInclusive: number, maxInclusive: number) {
    return (maxInclusive - minInclusive) * Math.random() + minInclusive;
  }
}
