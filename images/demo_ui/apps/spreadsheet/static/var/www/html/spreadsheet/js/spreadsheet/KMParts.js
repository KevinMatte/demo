class KMClass {
    constructor() {
        this.bindHandlers(this);
    }

    bindHandlers(obj) {
        let aThis = obj;
        while (obj = Reflect.getPrototypeOf(obj)) {
            let keys = Reflect.ownKeys(obj)
            keys.forEach((name) => {
                if (name.substring(0, 6) === 'handle' && !aThis.hasOwnProperty(name))
                    aThis[name] = aThis[name].bind(aThis);
            });
        }
    }

}

class KMCanvas extends KMClass {
    events = {};
    hasCapture = false;
    canvas = null;

    constructor(canvas) {
        super();
        this.setCanvas(canvas);
    }

    setCanvas(canvas) {
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
            this.handleResize();
        }
    }

    destroy() {
        this.setCanvas(null);
    }

    handleResize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    handleClickEvent(event) {

    }

    handleSaveMouseEvent(event) {
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

    handlePointerCapture(event) {
        if (event.buttons === 1) {
            this.canvas.setPointerCapture(event.pointerId);
            this.hasCapture = true;
        } else {
            this.canvas.releasePointerCapture(event.pointerId);
            this.hasCapture = false;
        }
    }

    handlePointerRelease(event) {
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

class KMDraw extends KMCanvas {
    constructor(elm) {
        elm = (typeof elm === 'string') ? document.getElementById(elm) : elm;
        super(elm.querySelector('.km_spd_canvas'));

        this.imageSave = null;
    }

    handleMouseUp(event) {
        let mouseDownEvent = this.takeEvent();
        if (mouseDownEvent === null)
            return;

        let ctx = this.canvas.getContext('2d');
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

    handleMouseMove(event) {
        if (!this.events.hasOwnProperty('mousedown'))
            return;
        if (event.buttons !== 1)
            return;
        let mouseDownEvent = this.events['mousedown'];

        let ctx = this.canvas.getContext('2d');
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
    constructor(vertical, lines) {
        this.vertical = vertical;
        this.lines = lines;

        this.gridSize = 0;
        for (let lineSetting of this.lines) {
            if (typeof (lineSetting) === 'number')
                this.gridSize += lineSetting;
            else
                this.gridSize += lineSetting.lineWidth;
        }
        this.nextStart = 0;
    }

    draw(ctx, start, end) {
        ctx.save();
        for (let line of this.lines) {
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
    constructor(isX) {
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

    getNextPos(pos) {
        if (pos === -1)
            pos = 0;
        else if (pos === this.lockCount - 1 && pos < this.viewPos)
            pos = this.viewPos;
        else
            pos++;
        return pos;
    }

    getGridLines(pos) {
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

