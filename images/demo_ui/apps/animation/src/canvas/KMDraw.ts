
import KMCanvas from "./KMCanvas.ts";

class KMDraw extends KMCanvas {
    imageSave : ImageData | null;

    constructor(elm: HTMLElement | string) {
        let elm2: HTMLElement | null  = (typeof elm === 'string') ? document.getElementById(elm) : elm;
        if (elm2) {
            let elmCanvas : HTMLElement | null = elm2.querySelector('.km_spd_canvas');
            if (elmCanvas instanceof HTMLCanvasElement)
                super(elmCanvas);
            else
                super(null);
        } else
            super(null);

        this.imageSave = null;
    }

    handleMouseUp = (event : MouseEvent)=> {
        if (!this.canvas)
            return;

        let mouseDownEvent = this.takeEvent();
        if (mouseDownEvent === null || !(mouseDownEvent instanceof MouseEvent))
            return;

        let ctx = this.canvas.getContext('2d');
        if (!ctx)
            return;

        if (this.imageSave !== null)
            ctx.putImageData(this.imageSave, 0, 0);
        this.imageSave = null;

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.strokeStyle = 'red';
        ctx.moveTo(mouseDownEvent.offsetX, mouseDownEvent.offsetY);
        ctx.lineTo(event.offsetX, event.offsetY);
        // ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    handleMouseMove = (event : MouseEvent)=> {
        if (!this.canvas)
            return;

        if (!this.events.hasOwnProperty('mousedown'))
            return;
        if (event.buttons !== 1)
            return;
        let mouseDownEvent = this.events['mousedown'];
        if (!(mouseDownEvent instanceof MouseEvent))
            return;

        let ctx = this.canvas.getContext('2d');
        if (!ctx)
            return;

        ctx.save();
        if (this.imageSave === null)
            this.imageSave = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        else
            ctx.putImageData(this.imageSave, 0, 0);
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.strokeStyle = 'green';
        ctx.moveTo(mouseDownEvent.offsetX, mouseDownEvent.offsetY);
        ctx.lineTo(event.offsetX, event.offsetY);
        // ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

export default KMDraw;