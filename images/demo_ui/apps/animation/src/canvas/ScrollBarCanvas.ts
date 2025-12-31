// TODO: Min scrollbar size
// TODO: Zoom shouldn't impact scrollbar width
import Canvas from "../canvas/Canvas.ts";

export type CanvasScrollbarListener = (onX: boolean, pos: number) => void;

class ScrollBarCanvas extends Canvas {
    dragStart: number | null;
    onX: boolean;
    listener: CanvasScrollbarListener;
    minIndex: number;
    maxIndex: number;
    visibleIndices: number;
    indexRange: number;
    indexStep: number;
    index: number;
    lineLength: number;
    lineStart: number = 0;
    fromLineStart: number = 0;
    canvasRange: number = 0;
    mouseDownEvent: MouseEvent | null = null;

    constructor(onX: boolean,
                listener: CanvasScrollbarListener,
                minIndex = 0,
                maxIndex = 100,
                visibleIndices = 30,
                step = 1) {
        super();
        this.dragStart = null;
        this.onX = onX;
        this.listener = listener;
        this.minIndex = minIndex;
        this.maxIndex = maxIndex;
        this.visibleIndices = visibleIndices;

        this.indexRange = 0;
        this.indexStep = step;

        this.index = this.minIndex;
        this.lineLength = this.visibleIndices / this.indexRange * this.canvasRange;

        this._setRange(minIndex, maxIndex, visibleIndices, step);
    }

    setVisible(visible: number) {
        this.visibleIndices = visible;
        this.redraw();
    }

    redraw() {
        this.setIndex(this.index);
    }

    setRange(minValue = 0, maxValue = 100, visible = 30, step = 1) {
        let hasChange = (this.maxIndex !== maxValue) || (this.minIndex !== minValue) ||
            (this.visibleIndices !== visible) || (this.indexStep !== step);
        this._setRange(minValue, maxValue, visible, step);
        if (hasChange)
            this.redraw();
    }

    _setRange(minValue: number, maxValue: number, visible: number, step: number) {
        this.minIndex = minValue;
        this.maxIndex = maxValue - step;
        this.indexRange = maxValue - minValue;
        this.visibleIndices = visible;
        this.indexStep = step;

        this._updateCanvasRange();
    }

    handleClickEvent(event: MouseEvent) {
        if (!this.canvas) return;

        let offset = this.onX ? event.offsetX : event.offsetY;
        let mouseDownEvent = this.mouseDownEvent;

        // Save starting position using event.
        if (mouseDownEvent !== null) {
            this.mouseDownEvent = null;
            if (event.offsetX >= 0 && event.offsetY >= 0 &&
                event.offsetX <= this.canvas.offsetWidth && event.offsetY <= this.canvas.offsetHeight) {
                let index = this.convertLineStartToIndex(offset - this.lineLength / 2);
                if (this.setIndex(index))
                    this.listener(this.onX, index);
            }
        } else
            this.dragStart = null;
    }

    handleMouseDown(event: MouseEvent) {
        this.mouseDownEvent = event;
        let dragStart = this.onX ? event.offsetX : event.offsetY;
        if (dragStart >= this.lineStart && dragStart <= this.lineStart + this.lineLength) {
            this.dragStart = dragStart;
            this.fromLineStart = this.lineStart;
            this.handleMouseMove(event);
        }
    }

    handleMouseMove(event: MouseEvent) {
        if (event.buttons !== 1 || this.dragStart === null)
            return;

        this.mouseDownEvent = null;

        let lineStartDelta = (this.onX ? event.offsetX : event.offsetY) - this.dragStart;
        let index = this.convertLineStartToIndex(this.fromLineStart + lineStartDelta);
        if (this.setIndex(index))
            this.listener(this.onX, index);
    }

    handleResize(event : UIEvent){
        super.handleResize(event);
        this.setCanvasDimensions();
        if (this.hasOwnProperty('onX')) {
            this._updateCanvasRange();
            this.redraw();
        }
    }

    _updateCanvasRange() {
        if (this.canvas) {
            this.canvasRange = (this.onX ? this.canvas.width : this.canvas.height);
            this.lineLength = this.visibleIndices / this.indexRange * this.canvasRange;
        }
    }

    setup(canvasElement: HTMLCanvasElement) {
        super.setup(canvasElement);
        canvasElement.addEventListener('mousemove', this.handleMouseMove);
        canvasElement.addEventListener('mousedown', this.handleMouseDown);
        canvasElement.addEventListener('click', this.handleClickEvent);
        this.enableCapture();
        this._updateCanvasRange();
        this.redraw();
    }

    setIndex(index: number) {
        index = Math.max(this.minIndex, index);
        index = Math.min(this.minIndex + this.indexRange - this.visibleIndices, index);
        let change = this.index !== index;

        this.index = index;
        let lineStart = (index - this.minIndex) * this.canvasRange / this.indexRange;
        if (lineStart + this.lineLength > this.canvasRange)
            lineStart = this.canvasRange - this.lineLength;

        if (!this.canvas) return;
        let ctx = this.canvas.getContext('2d');
        if (!ctx)
            return;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();
        let lineThickness = (this.onX ? this.canvas.height : this.canvas.width) / 2;
        ctx.lineWidth = lineThickness;
        ctx.strokeStyle = 'green';
        if (this.onX) {
            ctx.moveTo(lineStart, lineThickness);
            ctx.lineTo(lineStart + this.lineLength, lineThickness);
        } else {
            ctx.moveTo(lineThickness, lineStart);
            ctx.lineTo(lineThickness, lineStart + this.lineLength);
        }
        // ctx.closePath();
        ctx.stroke();
        this.lineStart = lineStart;

        return change;
    }

    convertLineStartToIndex(lineStart: number) {
        let index;
        index = this.minIndex + (this.indexRange / this.canvasRange * lineStart);
        if (index < this.minIndex)
            index = this.minIndex;
        else if (index > this.maxIndex)
            index = this.maxIndex;

        return Math.round(index / this.indexStep) * this.indexStep;
    }
}

export default ScrollBarCanvas;