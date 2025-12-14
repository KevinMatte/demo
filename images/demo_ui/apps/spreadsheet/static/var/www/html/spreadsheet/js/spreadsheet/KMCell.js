class KMCell {
    data;
    value;
    cellDefaults;
    details;
    isHover;
    paintRectangle;

    constructor(
        ctx,
        data,
        cellDefaults,
        details,
        isHover,
    ) {
        this.data = data;
        this.value = data.value;
        this.cellDefaults = cellDefaults;
        this.details = details;
        this.isHover = isHover;
    }

    cellPaint(ctx, x, y, columnWidth, rowHeight, rowTextAscent) {
    }

    handleEvent(event, details) {
    }
}

class KMCellText extends KMCell {
    inputNode;

    constructor(
        ctx,
        data,
        cellDefaults,
        details,
        isHover,
    ) {
        super(ctx, data, cellDefaults, details, isHover);

        ctx.save();
        let ctxProperties;
        if ((details.inLockX ?? false) || (details.inLockY ?? false)) {
            ctxProperties = {
                fillStyle: "lightgreen",
                strokeStyle: "black",
                lineWidth: 1,
            }
        } else if (isHover === 1 || isHover === 2) {
            ctxProperties = {
                fillStyle: "pink",
                strokeStyle: "black",
                lineWidth: 1,
            }
        } else
            ctxProperties = {lineWidth: 1};

        Object.assign(ctx, ctxProperties);

        let metrics = ctx.measureText(this.value);
        ctx.restore();

        this.cellDefaults = {...cellDefaults};
        this.cellPadding = this.cellDefaults.padding;
        this.cellWidth = Math.round(metrics.width + 1 + this.cellPadding * 2);
        this.cellHeight = Math.round(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 1 + this.cellPadding * 2);
        this.ascent = Math.round(metrics.actualBoundingBoxAscent);
        this.ctxProperties = ctxProperties;
        this.details = details;
        this.isHover = isHover;
    }

    cellPaint(ctx, x, y, columnWidth, rowHeight, rowTextAscent) {
        this.paintRectangle = {x, y, columnWidth, rowHeight};
        ctx.save();
        Object.assign(ctx, this.ctxProperties);

        if (this.ctxProperties.fillStyle)
            ctx.fillRect(x, y, columnWidth, rowHeight);
        if (typeof this.value === 'number' || (!this.isHover && this.ctxProperties.fillStyle)) {
            x += columnWidth - this.cellWidth;
            // y += rowHeight - this.cellHeight;
        }

        ctx.strokeText(this.value, x + this.cellPadding, y + rowTextAscent + this.cellPadding);
        ctx.restore();
    }

    handleEvent(event, details) {
        this.inputNode = document.createElement('input');
        this.inputNode.setAttribute('id', 'KM');
        this.inputNode.style.position = 'absolute';
        this.inputNode.style.top = `${this.paintRectangle.y+1}px`;
        this.inputNode.style.left = `${this.paintRectangle.x+1}px`;
        this.inputNode.style.gridSize = `${this.paintRectangle.columnWidth-1}px`;
        this.inputNode.style.height = `${this.paintRectangle.rowHeight-1}px`;
        this.inputNode.style.border = 0;
        this.inputNode.style.padding = 0;
        event.target.parentElement.appendChild(this.inputNode);
        this.inputNode.focus();
    }
}