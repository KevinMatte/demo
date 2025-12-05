import KMCanvas from "./canvas/KMCanvas.ts";
import KMDraw from "./canvas/KMDraw.ts";


class KMAnimation extends KMCanvas {

    lineDraw : KMDraw;

    constructor(canvas : HTMLCanvasElement) {
        super(canvas);
        this.lineDraw = new KMDraw(canvas);
    }
}

export default KMAnimation;