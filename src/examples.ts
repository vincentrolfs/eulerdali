import { PaintInputs } from "./utilities";

export type Example = Record<keyof PaintInputs, string>;
export const initialExample = 0;
export const examples: Example[] = [
  {
    red: "x",
    green: "y",
    blue: "x+y",
    zoom: "1",
  },
  {
    red: "sin(1 / log(cos(x) + 1 / tan(y)))",
    green: "cos(1 / log(tan(x) + 1 / sin(y)))",
    blue: "tan(1 / log(sin(x) + 1 / cos(y)))",
    zoom: "1/4",
  },
  {
    red: "(x*y % 2)/2",
    green: "(x*y % 3)/3",
    blue: "(x*y % 5)/5",
    zoom: "1/7",
  },
  {
    red: "sin(sqrt(abs(x+y)))",
    green: "sin(x/y)",
    blue: "sin(pow(abs(y), abs(x)) + pow(abs(x), abs(y)))",
    zoom: "1/10",
  },
  {
    red: "(y - cosh(x)) % 1",
    green: "y/6",
    blue: "y/6",
    zoom: "1/3",
  },
  {
    red: "x**2 + y**2",
    green: "x*y - (x**2)*y + x**3 - y",
    blue: "1.5*(y**2)*x - 1.5*x**2",
    zoom: "0.7",
  },
  {
    red: "(r = sqrt(x**2 + y**2)) && (r*cos(r) - x)**2 + (r*sin(r) - y)**2",
    green:
      "(r = sqrt(x**2 + y**2)) && (r*cos(2*r) - x)**2 + (r*sin(2*r) - y)**2",
    blue:
      "(r = sqrt(x**2 + y**2)) && (r*cos(4*r) - x)**2 + (r*sin(4*r) - y)**2",
    zoom: "1/7",
  },
];
