export type ColorFunc = (x: number, y: number) => number;
export type ZoomFunc = () => number;
export type PaintInputs = {
  red: ColorFunc;
  green: ColorFunc;
  blue: ColorFunc;
  zoom: ZoomFunc;
};