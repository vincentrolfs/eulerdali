import { PaintInputName } from "../common/utilities";

export const initialExample = 0;
export const examples: Record<PaintInputName | "name", string>[] = [
  {
    name: "Eulerdali logo",
    red: "(x-1) % y",
    green: "x % y",
    blue: "(x+1) % y",
    zoom: "1/2",
  },
  {
    name: "Simple example",
    red: "x+y",
    green: "x",
    blue: "y",
    zoom: "1",
  },
  {
    name: "Waterfunk",
    red: "1/(sin(x**2 + y**2) + 2*cos(x*y))",
    green: "1/(sin(x**2 + (y+PI)**2) - 3*cos(x*y))",
    blue: "1/(sin(x**2 + (y-PI)**2) - 1*cos(x*y))",
    zoom: "1/6",
  },
  {
    name: "Ancient runes",
    red: "sin(1 / log(cos(x) + 1 / tan(y)))",
    green: "cos(1 / log(tan(x) + 1 / sin(y)))",
    blue: "tan(1 / log(sin(x) + 1 / cos(y)))",
    zoom: "1/4",
  },
  {
    name: "Spiral",
    red: "(r = sqrt(x**2 + y**2)) && (r*cos(r) - x)**2 + (r*sin(r) - y)**2",
    green:
      "(r = sqrt(x**2 + y**2)) && (r*cos(2*r) - x)**2 + (r*sin(2*r) - y)**2",
    blue:
      "(r = sqrt(x**2 + y**2)) && (r*cos(4*r) - x)**2 + (r*sin(4*r) - y)**2",
    zoom: "1/7",
  },
  {
    name: "Strange waves",
    red: "(x*y % 2)/2",
    green: "(x*y % 3)/3",
    blue: "(x*y % 5)/5",
    zoom: "1/7",
  },
  {
    name: "Lightning logo",
    red: "1/(y+x**3)",
    green: "1/(1+x**2)",
    blue: "1/(1+x**2)",
    zoom: "1/6",
  },
  {
    name: "Old math",
    red: "sin(sqrt(abs(x+y)))",
    green: "sin(x/y)",
    blue: "sin(pow(abs(y), abs(x)) + pow(abs(x), abs(y)))",
    zoom: "1/10",
  },
  {
    name: "Superposition",
    red: "1.7/(x**2 + y**2)",
    green: ".25/(x*y - (x**2)*y + x**3 - y)",
    blue: "1/(1.5*(y**2)*x - 1.5*x**2)",
    zoom: "1/6",
  },
  {
    name: "Red mountains",
    red: "(y - cosh(x)) % 1",
    green: "y/6",
    blue: "y/6",
    zoom: "1/3",
  },
  {
    name: "Futuristic",
    red: "0.01/(((x-8)*y % 2)/2)",
    green: "0.01/(((x-8)*y % 3)/3)",
    blue: "0.01/(((x-8)*y % 3)/3)",
    zoom: "1/5",
  },
  {
    name: "Mondrian",
    red: "(x > 1 && x < 2 && y > 3 && y < 4) ? 1 : 0",
    green: "(x > -6 && x < -5 && y > 0 && y < 1) ? 1 : 0",
    blue: "(x > 5 && x < 6 && y > -4 && y < -3) ? 1 : 0",
    zoom: "1/10",
  },
  {
    name: "Pancake waves",
    red: "log(cos(y)-x/y)*4",
    green: "log(cos(y)-x/y)**4",
    blue: "2/sqrt(abs(2*y))",
    zoom: "1/20",
  },
  {
    name: "Stagefright",
    red: "log(cos(x)*cos(y)+1)",
    green: "log(cos(x)*cos(y)+1)**2",
    blue: "log(cos(x)*cos(y)+1)**3",
    zoom: "1/9",
  },
];
