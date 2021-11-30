import { Canvas } from "./Canvas";

export class Painting {
  private imageData: ImageData;

  constructor(private readonly canvas: Canvas) {
    this.imageData = new ImageData(canvas.width, canvas.height);
  }

  setPixel(
    x: number,
    y: number,
    color: [red: number, green: number, blue: number]
  ) {
    const redIndex = y * (this.canvas.width * 4) + x * 4;
    const greenIndex = redIndex + 1;
    const blueIndex = redIndex + 2;
    const alphaIndex = redIndex + 3;
    const [red, green, blue] = color;

    this.imageData.data[redIndex] = red;
    this.imageData.data[greenIndex] = green;
    this.imageData.data[blueIndex] = blue;
    this.imageData.data[alphaIndex] = 255;
  }

  apply() {
    this.canvas.putImageData(this.imageData);
  }
}
