import { Canvas } from "../Canvas";
import { Painter } from "../Painter";
import { PaintInputs } from "../common/utilities";
import { Painting } from "../Painting";

// {
//   name: "Test",
//     red: "((cos(t)*x + sin(t)*y)-1) % ((-sin(t)*x + cos(t)*y)*sin(t))",
//   green: "((cos(t)*x + sin(t)*y)+sin(t)) % (-sin(t)*x + cos(t)*y)",
//   blue: "((cos(t)*x + sin(t)*y)+1) % ((-sin(t)*x + cos(t)*y)*sin(t))",
//   zoom: "1/2",
// },
// {
//   name: "Test",
//     red: "cos(t)*x + sin(t)*y",
//   green: "-sin(t)*x + cos(t)*y",
//   blue: "cos(t)*x + sin(t)*y - sin(t)*x + cos(t)*y",
//   zoom: "1",
// },

export class Animator {
  constructor(private readonly painter: Painter) {}

  animate(paintInputs: PaintInputs) {
    const paintings: Painting[] = [];
    const amount = 100;

    for (let i = 0; i < amount; i++) {
      let t = 2 * Math.PI * (i / amount);

      paintings.push(this.painter.createPainting(paintInputs, t));
    }

    let currentPainting = 0;

    setInterval(() => {
      paintings[currentPainting].apply();

      currentPainting = (currentPainting + 1) % paintings.length;
    }, 50);
  }
}
