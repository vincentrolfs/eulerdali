export type ColorFunc = (x: number, y: number, t: number) => number;
export type ZoomFunc = (t: number) => number;

export const PaintInputNames = ["red", "green", "blue", "zoom"] as const;
export type PaintInputName = typeof PaintInputNames[number];
export type PaintInputs = {
  red: ColorFunc;
  green: ColorFunc;
  blue: ColorFunc;
  zoom: ZoomFunc;
};
const __ensure_subtype = (
  x: PaintInputs
): Record<PaintInputName, ColorFunc | ZoomFunc> => x;
