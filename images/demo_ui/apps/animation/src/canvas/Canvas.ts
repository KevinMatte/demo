import {bindHandlers} from '../utils/listeners.ts';

class Canvas {
    events: Record<string, UIEvent> = {};
    canvas!: HTMLCanvasElement;
    hasCapture = false

    constructor(canvas: HTMLCanvasElement|null = null) {
        bindHandlers(this);
        if (canvas)
            this.setCanvas(canvas);
    }

    setCanvas(canvasElement: HTMLCanvasElement) {
        this.canvas = canvasElement;
        this.canvas.addEventListener('mousedown', this.handleSaveMouseEvent);
        window.addEventListener('resize', this.handleResize);
        this.handleResize(new UIEvent('resize', {}));
    }

    getMousePos(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    destroy() {
        if (this.canvas)
            this.canvas.removeEventListener('mousedown', this.handleSaveMouseEvent);
        window.removeEventListener('resize', this.handleResize);
        this.disableCapture();
    }

    setCanvasDimensions() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    handleResize(_ev: UIEvent) {
        this.setCanvasDimensions();
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

    takeEvent(eventName: string): MouseEvent | null {
        let event = null;
        if (this.events.hasOwnProperty(eventName)) {
            event = this.events[eventName];
            delete this.events[eventName];
        }
        if (event instanceof MouseEvent)
            return event;
        else
            return null;
    }
}

export default Canvas;