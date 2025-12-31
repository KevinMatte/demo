type DrawerPaint = {
    paint(imageHolder: ImageHolder, data:any): void;
}

export {type DrawerPaint};

class ImageHolder {
    images: {aClass: DrawerPaint, data:any}[] = [];
    canvas: HTMLCanvasElement | null = null;

    constructor() {
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    getContext2D() {
        if (!this.canvas)
            return null;
        let ctx = this.canvas.getContext('2d');
        return ctx;
    }

    addImage(aClass: DrawerPaint, data: any) {
        this.images.push({aClass: aClass, data:data});

    }

    paint() {
        for (let i=0; i<this.images.length; i++) {
            let classVar = this.images[i].aClass;
            classVar.paint(this, this.images[i].data);
        }
    }

    static drawLine(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }
}

export default ImageHolder;