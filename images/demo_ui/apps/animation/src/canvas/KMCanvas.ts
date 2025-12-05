
class KMCanvas  {
    events : Record<string, UIEvent> = {};
    canvas : HTMLCanvasElement | null = null;
    hasCapture = false

    constructor(canvas: HTMLCanvasElement | null) {
        this.setCanvas(canvas);
    }

    setCanvas(canvas: HTMLCanvasElement | null) {
        if (this.canvas === canvas)
            return;
        if (this.canvas !== null) {
            this.canvas.removeEventListener('mousedown', this.handleSaveMouseEvent);
            window.removeEventListener('resize', this.handleResize);
            this.disableCapture();
        }
        this.canvas = canvas;
        if (this.canvas !== null) {
            this.canvas.addEventListener('mousedown', this.handleSaveMouseEvent);
            window.addEventListener('resize', this.handleResize);
            this.handleResize(new UIEvent('resize', {}));
        }
    }

    destroy() {
        this.setCanvas(null);
    }

    handleResize = (_ev : UIEvent) => {
        if (this.canvas) {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }
    }

    handleClickEvent = (_ev : UIEvent) => {

    }

    handleSaveMouseEvent = (event: UIEvent)=> {
        this.events[event.type] = event;
    }

    enableCapture() {
        if (!this.canvas)
            return;

        this.hasCapture = true;
        this.canvas.addEventListener('pointerdown', this.handlePointerCapture);
        this.canvas.addEventListener('pointerup', this.handlePointerRelease);
    }

    disableCapture() {
        if (!this.canvas)
            return;

        if (this.hasCapture) {
            this.canvas.removeEventListener('pointerdown', this.handlePointerCapture);
            this.canvas.removeEventListener('pointerup', this.handlePointerRelease);
            this.hasCapture = false;
        }
    }

    handlePointerCapture = (event : PointerEvent)=> {
        if (!this.canvas)
            return;

        if (event.buttons === 1) {
            this.canvas.setPointerCapture(event.pointerId);
            this.hasCapture = true;
        } else {
            this.canvas.releasePointerCapture(event.pointerId);
            this.hasCapture = false;
        }
    }

    handlePointerRelease = (event : PointerEvent)=> {
        if (!this.canvas)
            return;

        if (this.hasCapture) {
            this.canvas.releasePointerCapture(event.pointerId);
            this.hasCapture = false;
        }
    }

    takeEvent() {
        let event = null;
        if (this.events.hasOwnProperty('mousedown')) {
            event = this.events['mousedown'];
            delete this.events['mousedown'];
        }
        return event;
    }
}

export default KMCanvas;

