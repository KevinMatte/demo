import {bindHandlers} from '../utils/listeners.ts';

class KMCanvas {
    events: Record<string, UIEvent> = {};
    canvas!: HTMLCanvasElement;
    hasCapture = false

    constructor(canvas: HTMLCanvasElement|null = null) {
        bindHandlers(this);
        if (canvas)
            this.setCanvas(canvas);
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.addEventListener('mousedown', this.handleSaveMouseEvent);
        window.addEventListener('resize', this.handleResize);
        this.handleResize(new UIEvent('resize', {}));
    }

    destroy() {
        if (this.canvas)
            this.canvas.removeEventListener('mousedown', this.handleSaveMouseEvent);
        window.removeEventListener('resize', this.handleResize);
        this.disableCapture();
    }

    setCanvasDimenstions() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    handleResize(_ev: UIEvent) {
        this.setCanvasDimenstions();
    }

    handleClickEvent(_ev: MouseEvent) {

    }

    handleSaveMouseEvent(event: MouseEvent) {
        this.events[event.type] = event;
    }

    enableCapture() {
        this.hasCapture = true;
        this.canvas.addEventListener('pointerdown', this.handlePointerCapture);
        this.canvas.addEventListener('pointerup', this.handlePointerRelease);
    }

    disableCapture() {
        if (this.hasCapture) {
            this.canvas.removeEventListener('pointerdown', this.handlePointerCapture);
            this.canvas.removeEventListener('pointerup', this.handlePointerRelease);
            this.hasCapture = false;
        }
    }

    handlePointerCapture(event: PointerEvent) {
        if (event.buttons === 1) {
            this.canvas.setPointerCapture(event.pointerId);
            this.hasCapture = true;
        } else {
            this.canvas.releasePointerCapture(event.pointerId);
            this.hasCapture = false;
        }
    }

    handlePointerRelease(event: PointerEvent) {
        if (this.hasCapture) {
            this.canvas.releasePointerCapture(event.pointerId);
            this.hasCapture = false;
        }
    }

    takeEvent(): MouseEvent | null {
        let event = null;
        if (this.events.hasOwnProperty('mousedown')) {
            event = this.events['mousedown'];
            delete this.events['mousedown'];
        }
        if (event instanceof MouseEvent)
            return event;
        else
            return null;
    }
}

class KMDraw extends KMCanvas {
    imageSave: any = null;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.imageSave = null;
    }

    handleMouseUp(event: MouseEvent) {
        let mouseDownEvent = this.takeEvent();
        if (mouseDownEvent === null)
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

    handleMouseMove(event: MouseEvent) {
        if (!this.events.hasOwnProperty('mousedown'))
            return;
        if (event.buttons !== 1)
            return;

        let mouseDownEvent = this.events['mousedown'] as MouseEvent;
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

class KMGridLine {
    vertical: boolean;
    lines: Record<string, any> = {};
    gridSize: number;
    nextStart: number;

    constructor(vertical: boolean, lines: {}) {
        this.vertical = vertical;
        this.lines = lines;

        this.gridSize = 0;
        for (let lineSettingKey in this.lines) {
            let lineSetting: any = this.lines[lineSettingKey];
            if (typeof lineSetting === 'number')
                this.gridSize += lineSetting;
            else if (typeof lineSetting === 'object')
                this.gridSize += lineSetting['lineWidth'];
        }
        this.nextStart = 0;
    }

    draw(ctx: CanvasRenderingContext2D, start: number, end: number) {
        ctx.save();
        for (let lineKey in this.lines) {
            let line: any = this.lines[lineKey];
            if (typeof line === 'number') {
                start += line;
            } else {
                ctx.beginPath();
                Object.assign(ctx, line);
                let pos = start + (line.lineWidth + 1) / 2;
                if (this.vertical) {
                    ctx.moveTo(pos, 0);
                    ctx.lineTo(pos, end);
                } else {
                    ctx.moveTo(0, pos);
                    ctx.lineTo(end, pos);
                }
                ctx.stroke();
                start += line.lineWidth;
            }
        }
        ctx.restore();
        this.nextStart = start;
        return start;
    }
}

class KMAxis {
    isX: boolean = true;
    lockCount: number;
    viewPos: number;
    viewMax: number;
    scrollMax: number;
    max: number;
    gridLines0: KMGridLine;
    gridLines: KMGridLine;
    gridLinesLabel: KMGridLine;

    constructor(isX: boolean) {
        this.isX = isX;
        this.lockCount = 1;
        this.viewPos = 0;
        this.viewMax = 0;
        this.scrollMax = 0;
        this.max = 0;
        this.gridLines0 = new KMGridLine(this.isX,
            [
                {lineWidth: 1, strokeStyle: 'black'},
            ]
        );
        this.gridLines = new KMGridLine(this.isX,
            [
                {lineWidth: 1, strokeStyle: 'black'},
            ]
        );
        this.gridLinesLabel = new KMGridLine(
            this.isX,
            [
                {lineWidth: 2, strokeStyle: 'grey'},
                {lineWidth: 2, strokeStyle: 'black'},
                {lineWidth: 2, strokeStyle: 'grey'},
            ]
        );
    }

    getNextPos(pos: number) {
        if (pos === -1)
            pos = 0;
        else if (pos === this.lockCount - 1 && pos < this.viewPos)
            pos = this.viewPos;
        else
            pos++;
        return pos;
    }

    getGridLines(pos: number) {
        let gridLines;
        if (pos === 0)
            gridLines = this.gridLines0;
        else if (pos === this.viewPos)
            gridLines = this.gridLinesLabel;
        else
            gridLines = this.gridLines;
        return gridLines;
    }

}

export {KMDraw, KMCanvas, KMGridLine, KMAxis};