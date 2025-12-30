import {bindHandlers} from '../utils/listeners.ts';
import ImageHolder from './ImageHolder';

class Canvas {
    canvas?: HTMLCanvasElement;
    imageHolder?: ImageHolder;
    hasCapture = false


    constructor() {
        bindHandlers(this);
    }

    setup(canvasElement: HTMLCanvasElement, imageHolder: ImageHolder|null = null) {
        this.canvas = canvasElement;
        this.imageHolder = imageHolder;
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
}

export default Canvas;