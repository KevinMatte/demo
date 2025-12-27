// TODO: JSON Configurable
// TODO: Edit
import {KMCanvas} from "./KMParts.ts";
import KMScrollbar from "./KMScrollbar.ts";

class KMPaint extends KMCanvas {
    mouseDownEvent: MouseEvent | null = null;
    mouseUpEvent: MouseEvent | null = null;
    hScroll!: KMScrollbar;
    vScroll!: KMScrollbar;

    isDrawing = false;
    lastPosition = {x: 0, y: 0};

    constructor() {
        super(null);
    }

    setCanvases(canvas: HTMLCanvasElement, hScrollCanvas: HTMLCanvasElement, vScrollCanvas: HTMLCanvasElement) {
        this.hScroll = new KMScrollbar(
            hScrollCanvas,
            true,
            this.handleHScroll,
        );
        this.vScroll = new KMScrollbar(
            vScrollCanvas,
            false,
            this.handleVScroll,
        );

        super.setCanvas(canvas);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseout', this.handleMouseUp);
        this.canvas.addEventListener('click', this.handleMouseClick);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
    }

    handleMouseClick(_event: MouseEvent) {
        if (!this.mouseDownEvent)
            return;
    }

    getMousePos(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };


    handleMouseDown(event: MouseEvent) {
        this.mouseDownEvent = event;
        this.mouseUpEvent = null;

        this.isDrawing = true;
        this.lastPosition = this.getMousePos(event);
    }

    handleMouseUp(event: MouseEvent) {
        this.mouseUpEvent = event;
        this.isDrawing = false;
    }

    handleMouseMove(event: MouseEvent) {
        let ctx = this.canvas.getContext('2d');
        if (!ctx || !this.isDrawing) return;
        const currentPos = this.getMousePos(event);

        ctx.beginPath();
        ctx.moveTo(this.lastPosition.x, this.lastPosition.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();

        this.lastPosition = currentPos;
    }

    handleResize(event: UIEvent) {
        super.handleResize(event)
    }

    handleHScroll(_pos: number) {
        return;
    }

    handleVScroll(_pos: number) {
        return;
    }

}

export {KMPaint};