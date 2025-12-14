// TODO: JSON Configurable
// TODO: Edit

class KMSpreadsheet extends KMCanvas {
    divID;
    mouseDownEvent = null;
    mouseUpEvent = null;
    dataSource = null;
    columnWidths = [];
    rowHeights = [];
    rowTextAscents = {};
    x = new KMAxis(true);
    y = new KMAxis(false);
    cellManager = null;
    elm;
    hScroll;
    vScroll;

    constructor(elm, dataSource) {
        super(null);

        this.setDataSource(dataSource);

        this.elm = (typeof elm === 'string') ? document.getElementById(elm) : elm;
        this.divID = this.elm.getAttribute('id');
        this.renderHTML();

        this.hScroll = new KMScrollbar(
            this.elm.querySelector('.km_spd_col_scroll'),
            true,
            this.handleHScroll,
            this.x.lockCount,
            dataSource.getNumColumns(),
        );
        this.vScroll = new KMScrollbar(
            this.elm.querySelector('.km_spd_row_scroll'),
            false,
            this.handleVScroll,
            this.y.lockCount,
            dataSource.getNumRows()
        );
        let canvas = this.elm.querySelector('.km_spd_canvas');
        this.setCanvas(canvas);

        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('click', this.handleMouseClick);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.setPos(this.x.lockCount, this.y.lockCount);
    }

    renderHTML() {
        let queryString = window.location.search;
        let queryParams = new URLSearchParams(queryString);
        let back = queryParams.get('back');
        let backElement = "";
        if (back) {
            backElement = `
                <input type="button"
                       onclick='window.location.assign("${back}")' value="Back to playground"
                       style='background: yellow;'
                />
            `;
        }

        let parser = new DOMParser();
        let doc = parser.parseFromString(`
<div id="spreadsheet" class="km_spd_cell">
    ${backElement}
    <canvas class="km_spd_canvas fill">Support for HTML Canvas required.</canvas>
    <canvas class="km_spd_row_scroll km_spd_scroll_width"></canvas>
    <canvas class="km_spd_col_scroll km_spd_scroll_height"></canvas>
</div>
        `, 'text/html');

        let elm = doc.getElementById('spreadsheet');
        for (let i = 0; i < elm.classList.length; ++i)
            this.elm.classList.add(elm.classList.item(i));

        // Empty this.elm div
        while (this.elm.firstChild)
            this.elm.removeChild(this.elm.lastChild);

        // Add new content
        while (elm.childNodes.length > 0)
            this.elm.appendChild(elm.childNodes[0]);
    }

    handleMouseClick(event) {
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
        if (!clickDetails.onXGrid && !clickDetails.onYGrid) {
            let cell = this.cellManager.getCell(clickDetails.posX, clickDetails.posY);
            if (cell)
                cell.handleEvent(event, clickDetails);
        }
    }

    handleMouseDown(event) {
        this.mouseDownEvent = event;
        this.mouseUpEvent = null;
    }

    handleMouseUp(event) {
        this.mouseUpEvent = event;
    }

    handleMouseMove(event) {
        if (event.buttons !== 0)
            return;

        let offsetDetails = this.getOffsetDetails(event.offsetX, event.offsetY);

        if (this.hoverX === offsetDetails.posX && this.hoverY === offsetDetails.posY && this.onXGrid === offsetDetails.onXGrid && this.onYGrid === offsetDetails.onYGrid)
            return;

        this.hoverX = offsetDetails.posX;
        this.onXGrid = offsetDetails.onXGrid;
        this.hoverY = offsetDetails.posY;
        this.onYGrid = offsetDetails.onYGrid;

        let details = {
            isHover: true,
            hoverX: this.hoverX,
            onXGrid: this.onXGrid,
            hoverY: this.hoverY,
            onYGrid: this.onYGrid,
        }
        this.repaint(details);
        // console.log(`mouse ${posX}(${onXGrid ? 'Grid' : ''}), ${posY}(${onYGrid ? 'Grid' : ''})`);
    }

    getOffsetDetails(offsetX, offsetY) {
        let x, y, posX, posY;
        let gridX, gridY;
        let onXGrid = false, onYGrid = false;

        x = 0;
        posX = this.x.getNextPos(-1);
        gridX = this.x.getGridLines(posX);
        while (x < this.canvas.width && posX < this.x.max) {
            x += gridX.width;
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
            y += gridY.width;
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

    handleResize() {
        super.handleResize();
        this.setPos(this.x.viewPos, this.y.viewPos);
    }

    setDataSource(dataSource) {
        this.cellManager = new KMCellManager(dataSource);
        this.dataSource = dataSource;
        this.x.max = this.dataSource.getNumColumns();
        this.y.max = this.dataSource.getNumRows();
        if (this.hScroll) {
            this.hScroll.setRange(this.x.lockCount, this.dataSource.getNumColumns());
            this.vScroll.setRange(this.y.lockCount, this.dataSource.getNumRows());
        }
    }

    handleHScroll(pos) {
        this.setPos(pos, this.y.viewPos, true);
    }

    handleVScroll(pos) {
        this.setPos(this.x.viewPos, pos, false);
    }

    setPos(posX, posY, onX = null) {
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

    repaint(details = {}) {
        let x, y, maxX, maxY, posX, posY;
        let gridX, gridY;
        let cell;

        let ctx = this.canvas.getContext('2d');
        ctx.save();
        let style = window.getComputedStyle(this.canvas);
        ctx.font =
            style.getPropertyValue('font-size') + ' ' +
            style.getPropertyValue('font-family');
        if (!this.dataSource.hasOwnProperty("getColumnSample") && !this.dataSource.hasOwnProperty("getRowSample")) {
            x = 0;
            posX = this.x.getNextPos(-1);
            gridX = this.x.getGridLines(posX);
            this.columnWidths = [];
            this.rowHeights = [];
            this.rowTextAscents = {};
            this.cellManager.loadStart();
            while (x < this.canvas.width && posX < this.x.max) {
                details.inLockX = posX < this.x.lockCount;
                y = 0;
                posY = this.y.getNextPos(-1);
                gridY = this.y.getGridLines(posY);
                while (y < this.canvas.height && posY < this.y.max) {
                    details.inLockY = posY < this.y.lockCount;
                    cell = this.cellManager.loadCell(ctx, posX, posY, details);
                    this.columnWidths[posX] = Math.max(this.columnWidths[posX] ?? 0, cell.cellWidth);
                    this.rowHeights[posY] = Math.max(this.rowHeights[posY] ?? 0, cell.cellHeight);
                    this.rowTextAscents[posY] = Math.max(this.rowTextAscents[posY] ?? 0, cell.ascent);
                    y += this.rowHeights[posY] + gridY.width;
                    posY = this.y.getNextPos(posY);
                    gridY = this.y.getGridLines(posY);
                }

                x += this.columnWidths[posX] + gridX.width;
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
            x += this.columnWidths[posX] + gridX.width;
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
            y += this.rowHeights[posY] + gridY.width;
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

    paint(ctx, maxX, maxY) {
        let x, y, posX, posY, gridX, gridY;

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

