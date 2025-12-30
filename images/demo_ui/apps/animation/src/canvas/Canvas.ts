import {bindHandlers} from '../utils/listeners.ts';

class Canvas {
    canvas?: HTMLCanvasElement;
    hasCapture = false


    constructor() {
        bindHandlers(this);
    }

    setup(canvasElement: HTMLCanvasElement) {
        this.canvas = canvasElement;
        window.addEventListener('resize', this.handleResize);
        this.handleResize(new UIEvent('resize', {}));
    }

    getMousePos(event: MouseEvent) {
        if (!this.canvas)
            return {x: 0, y: 0};

        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    destroy() {
        window.removeEventListener('resize', this.handleResize);
        this.disableCapture();
    }

    setCanvasDimensions() {
        if (!this.canvas)
            return;

        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    handleResize(_ev: UIEvent) {
        this.setCanvasDimensions();
    }

    handleClickEvent(_ev: MouseEvent) {

    }

    enableCapture() {
        if (!this.canvas) return;
        this.hasCapture = true;
        this.canvas.addEventListener('pointerdown', this.handlePointerCapture);
        this.canvas.addEventListener('pointerup', this.handlePointerRelease);
    }

    disableCapture() {
        if (this.canvas && this.hasCapture) {
            this.canvas.removeEventListener('pointerdown', this.handlePointerCapture);
            this.canvas.removeEventListener('pointerup', this.handlePointerRelease);
            this.hasCapture = false;
        }
    }

    handlePointerCapture(event: PointerEvent) {
        if (!this.canvas) return;
        if (event.buttons === 1) {
            this.canvas.setPointerCapture(event.pointerId);
            this.hasCapture = true;
        } else {
            this.canvas.releasePointerCapture(event.pointerId);
            this.hasCapture = false;
        }
    }

    handlePointerRelease(event: PointerEvent) {
        if (!this.canvas) return;
        if (this.hasCapture) {
            this.canvas.releasePointerCapture(event.pointerId);
            this.hasCapture = false;
        }
    }
}

export default Canvas;