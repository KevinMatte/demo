import Canvas from "../canvas/Canvas.ts";
import ImageHolder from "./ImageHolder.ts";

class PenDrawer extends Canvas {
    mouseDownEvent: MouseEvent | null = null;
    mouseUpEvent: MouseEvent | null = null;

    isDrawing = false;
    lastPosition = {x: 0, y: 0};
    imageHolder: ImageHolder;
    points: [number, number][] = [];

    constructor(imageHolder: ImageHolder) {
        super();
        this.imageHolder = imageHolder;
    }

    static paint(imageHolder: ImageHolder, data:any): void {
        let ctx = imageHolder.getContext2D();
        if (ctx) {
            let points = data as [x:number, y:number][];
            for (let i=0; i<points.length - 1; i++)
                ImageHolder.drawLine(ctx, points[i][1], points[i][0], points[i+1][0], points[i+1][1]);
        }
    }

    setProps(canvas: HTMLCanvasElement, _topX: number, _topY: number) {
        super.setup(canvas);
        if (!this.canvas)
            return;
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseout', this.handleMouseUp);
        this.canvas.addEventListener('click', this.handleMouseClick);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
    }

    destroy() {
        super.destroy();
        if (this.canvas) {
            this.canvas.removeEventListener('mousedown', this.handleMouseDown);
            this.canvas.removeEventListener('mouseup', this.handleMouseUp);
            this.canvas.removeEventListener('mouseout', this.handleMouseUp);
            this.canvas.removeEventListener('click', this.handleMouseClick);
            this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        }
    }

    handleMouseClick(_event: MouseEvent) {
        if (!this.mouseDownEvent)
            return;
    }

    handleMouseDown(event: MouseEvent) {
        this.mouseDownEvent = event;
        this.mouseUpEvent = null;

        this.isDrawing = true;
        this.lastPosition = this.getMousePos(event);
        this.points = [[this.lastPosition.x, this.lastPosition.y]];
    }

    handleMouseUp(event: MouseEvent) {
        this.mouseUpEvent = event;
        this.isDrawing = false;
        if (this.points.length > 1)
            this.imageHolder.addImage(PenDrawer, this.points);
        this.points = [];
    }

    handleMouseMove(event: MouseEvent) {
        let ctx = this.canvas?.getContext('2d');
        if (!ctx || !this.isDrawing) return;
        const currentPos = this.getMousePos(event);
        this.points.push([currentPos.x, currentPos.y]);

        let fromX = this.lastPosition.x;
        let fromY = this.lastPosition.y;
        let toX = currentPos.x;
        let toY = currentPos.y;
        ImageHolder.drawLine(ctx, fromX, fromY, toX, toY);

        this.lastPosition = currentPos;
    }
}

export {PenDrawer};