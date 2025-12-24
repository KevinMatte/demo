// TODO: JSON Configurable
// TODO: Edit
import {KMCanvas} from "./KMParts.ts";
import {KMAxis} from "./KMParts.ts";
import {KMDataSource} from "./KMDataSource.ts";
import KMScrollbar from "./KMScrollbar.ts";
import {KMCellManager} from "./KMCellManager.ts";
import {KMCell, KMCellText} from "./KMCell.ts";

class KMSpreadsheet extends KMCanvas {
    mouseDownEvent: MouseEvent | null = null;
    mouseUpEvent: MouseEvent | null = null;
    dataSource: KMDataSource | null = null;
    columnWidths : Array<number> = [];
    rowHeights: Array<number> = [];
    rowTextAscents: Array<number> = [];
    x = new KMAxis(true);
    y = new KMAxis(false);
    cellManager: KMCellManager | null = null;
    hScroll!: KMScrollbar;
    vScroll!: KMScrollbar;

    isDrawing = false;
    lastPosition = {x: 0, y: 0};

    constructor(dataSource: KMDataSource) {
        super(null);

        this.setDataSource(dataSource);
    }

    setCanvases(canvas: HTMLCanvasElement, hScrollCanvas: HTMLCanvasElement, vScrollCanvas: HTMLCanvasElement) {
        if (this.dataSource == null)
            return;

        this.hScroll = new KMScrollbar(
            hScrollCanvas,
            true,
            this.handleHScroll,
            this.x.lockCount,
            this.dataSource.getNumColumns(),
        );
        this.vScroll = new KMScrollbar(
            vScrollCanvas,
            false,
            this.handleVScroll,
            this.y.lockCount,
            this.dataSource.getNumRows()
        );

        super.setCanvas(canvas);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseout', this.handleMouseUp);
        this.canvas.addEventListener('click', this.handleMouseClick);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.setPos(this.x.lockCount, this.y.lockCount);
    }

    handleMouseClick(event: MouseEvent) {
        if (!this.mouseDownEvent)
            return;

        let clickDetails = this.getOffsetDetails(event.offsetX, event.offsetY);
        let downDetails = this.getOffsetDetails(this.mouseDownEvent.offsetX, this.mouseDownEvent.offsetY);
        if (
            clickDetails.posX !== downDetails.posX ||
            clickDetails.posY !== downDetails.posY ||
            clickDetails.onXGrid !== downDetails.onXGrid ||
            clickDetails.onYGrid !== downDetails.onYGrid
        )
            return;

        // If clicking in a cell.
        if (!clickDetails.onXGrid && !clickDetails.onYGrid && this.cellManager) {
            let cell = this.cellManager.getCell(clickDetails.posX, clickDetails.posY);
            if (cell)
                cell.handleEvent(event, clickDetails);
        }
    }

    getMousePos(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };


    handleMouseDown(event: MouseEvent) {
        this.mouseDownEvent = event;
        this.mouseUpEvent = null;

        this.isDrawing = true;
        this.lastPosition = this.getMousePos(event);
    }

    handleMouseUp(event: MouseEvent) {
        this.mouseUpEvent = event;
        this.isDrawing = false;
    }

    handleMouseMove(event: MouseEvent) {
        let ctx = this.canvas.getContext('2d');
        if (!ctx || !this.isDrawing) return;
        const currentPos = this.getMousePos(event);

        ctx.beginPath();
        ctx.moveTo(this.lastPosition.x, this.lastPosition.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();

        this.lastPosition = currentPos;
    }

    getOffsetDetails(offsetX: number, offsetY: number) {
        let x, y, posX, posY;
        let gridX, gridY;
        let onXGrid = false, onYGrid = false;

        x = 0;
        posX = this.x.getNextPos(-1);
        gridX = this.x.getGridLines(posX);
        while (x < this.canvas.width && posX < this.x.max) {
            x += gridX.gridSize;
            if (x >= offsetX) {
                onXGrid = true;
                break;
            }
            x += this.columnWidths[posX];
            if (x >= offsetX) {
                onXGrid = false;
                break;
            }
            posX = this.x.getNextPos(posX);
            gridX = this.x.getGridLines(posX);
        }

        y = 0;
        posY = this.y.getNextPos(-1);
        gridY = this.y.getGridLines(posY);
        while (y < this.canvas.height && posY < this.y.max) {
            y += gridY.gridSize;
            if (y >= offsetY) {
                onYGrid = true;
                break;
            }
            y += this.rowHeights[posY];
            if (y >= offsetY) {
                onYGrid = false;
                break;
            }
            posY = this.y.getNextPos(posY);
            gridY = this.y.getGridLines(posY);
        }

        return {
            posX,
            posY,
            onXGrid,
            onYGrid,
        };
    }

    handleResize(event: UIEvent) {
        super.handleResize(event)
        if (this.x && this.y)
            this.setPos(this.x.viewPos, this.y.viewPos);
    }

    setDataSource(dataSource: KMDataSource) {
        this.cellManager = new KMCellManager(dataSource);
        this.dataSource = dataSource;
        this.x.max = this.dataSource.getNumColumns();
        this.y.max = this.dataSource.getNumRows();
        if (this.hScroll) {
            this.hScroll.setRange(this.x.lockCount, this.dataSource.getNumColumns());
            this.vScroll.setRange(this.y.lockCount, this.dataSource.getNumRows());
        }
    }

    handleHScroll(pos: number) {
        this.setPos(pos, this.y.viewPos, true);
    }

    handleVScroll(pos: number) {
        this.setPos(this.x.viewPos, pos, false);
    }

    setPos(posX: number, posY: number, onX: boolean | null = null) {
        this.x.viewPos = posX;
        this.y.viewPos = posY;
        this.repaint();

        let gridX = this.x.getGridLines(this.x.viewPos);
        this.hScroll.setRange(gridX.nextStart, this.x.lockCount, this.x.max, this.x.scrollMax - this.x.viewPos);
        if (onX !== true)
            this.hScroll.setIndex(posX);

        let gridY = this.y.getGridLines(this.y.viewPos);
        this.vScroll.setRange(gridY.nextStart, this.y.lockCount, this.y.max, this.y.scrollMax - this.y.viewPos);
        if (onX !== false)
            this.vScroll.setIndex(posY);
    }

    repaint(details: Record<string, any> = {}) {
        let x, y, maxX, maxY, posX, posY;
        let gridX, gridY;
        let cell : KMCell | null;

        let ctx = this.canvas.getContext('2d');
        if (!ctx)
            return;

        ctx.save();
        let style = window.getComputedStyle(this.canvas);
        ctx.font =
            style.getPropertyValue('font-size') + ' ' +
            style.getPropertyValue('font-family');
        if (this.dataSource && this.cellManager &&
            !this.dataSource.hasOwnProperty("getColumnSample") &&
            !this.dataSource.hasOwnProperty("getRowSample")) {
            x = 0;
            posX = this.x.getNextPos(-1);
            gridX = this.x.getGridLines(posX);
            this.columnWidths = [];
            this.rowHeights = [];
            this.rowTextAscents = [];
            this.cellManager.loadStart();
            while (x < this.canvas.width && posX < this.x.max) {
                details.inLockX = posX < this.x.lockCount;
                y = 0;
                posY = this.y.getNextPos(-1);
                gridY = this.y.getGridLines(posY);
                while (y < this.canvas.height && posY < this.y.max) {
                    details.inLockY = posY < this.y.lockCount;
                    cell = this.cellManager.loadCell(ctx, posX, posY, details);
                    if (cell instanceof KMCellText) {
                        this.columnWidths[posX] = Math.max(this.columnWidths[posX] ?? 0, cell.cellWidth);
                        this.rowHeights[posY] = Math.max(this.rowHeights[posY] ?? 0, cell.cellHeight);
                        this.rowTextAscents[posY] = Math.max(this.rowTextAscents[posY] ?? 0, cell.ascent);
                    }
                    y += this.rowHeights[posY] + gridY.gridSize;
                    posY = this.y.getNextPos(posY);
                    gridY = this.y.getGridLines(posY);
                }

                x += this.columnWidths[posX] + gridX.gridSize;
                posX = this.x.getNextPos(posX);
                gridX = this.x.getGridLines(posX);
            }
            this.cellManager.loadEnd();
        }

        // From max widths, get total widths and max X.
        x = 0;
        posX = this.x.getNextPos(-1);
        gridX = this.x.getGridLines(posX);
        while (x < this.canvas.width && posX < this.x.max) {
            x += this.columnWidths[posX] + gridX.gridSize;
            posX = this.x.getNextPos(posX);
            gridX = this.x.getGridLines(posX);
        }
        maxX = x;
        this.x.viewMax = posX;
        this.x.scrollMax = (maxX <= this.canvas.width) ? this.x.viewMax : this.x.viewMax - 1;

        // From max heights, get total heights and max Y.
        y = 0;
        posY = this.y.getNextPos(-1);
        gridY = this.y.getGridLines(posY);
        while (y < this.canvas.height && posY < this.y.max) {
            y += this.rowHeights[posY] + gridY.gridSize;
            posY = this.y.getNextPos(posY);
            gridY = this.y.getGridLines(posY);
        }
        maxY = y;
        this.y.viewMax = posY;
        this.y.scrollMax = (maxY <= this.canvas.height) ? this.y.viewMax : this.y.viewMax - 1;

        this.paint(ctx, maxX, maxY);

        // Cleanup
        ctx.restore();
    }

    paint(ctx: CanvasRenderingContext2D, maxX: number, maxY: number) {
        let x, y, posX, posY, gridX, gridY;
        if (!this.cellManager)
            return;

        // Clear background
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid.
        x = 0;
        posX = this.x.getNextPos(-1);
        gridX = this.x.getGridLines(posX);
        while (posX <= this.x.viewMax) {
            x = gridX.draw(ctx, x, maxY);

            y = 0;
            posY = this.y.getNextPos(-1);
            gridY = this.y.getGridLines(posY);
            while (posY <= this.y.viewMax && posX < this.x.viewMax) {
                y = gridY.draw(ctx, y, maxX)

                if (posX < this.x.viewMax && posY < this.y.viewMax) {
                    let cell = this.cellManager.cellByKey[`${posX}-${posY}`];
                    let columnWidth = this.columnWidths[posX];
                    let rowHeight = this.rowHeights[posY];
                    let rowTextAscent = this.rowTextAscents[posY];
                    cell.cellPaint(ctx, x, y, columnWidth, rowHeight, rowTextAscent);

                    y += this.rowHeights[posY];
                }

                posY = this.y.getNextPos(posY);
                gridY = this.y.getGridLines(posY);
            }

            x += this.columnWidths[posX];
            posX = this.x.getNextPos(posX);
            gridX = this.x.getGridLines(posX);
        }
    }
}

export {KMSpreadsheet};