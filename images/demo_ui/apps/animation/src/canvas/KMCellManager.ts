import {KMDataSource} from "./KMDataSource.ts";
import {KMCell, KMCellText} from "./KMCell.ts";

class KMCellManager {
    dataSource: KMDataSource;
    cellByKey: Record<string, KMCell> = {};
    oldCells: Record<string, KMCell> | null = null;
    cellDefaults = {padding: 4};

    constructor(dataSource: KMDataSource) {
        this.dataSource = dataSource;
    }

    getCell(posX: number, posY: number) {
        let key = `${posX}-${posY}`;
        return this.cellByKey[key] ?? null;
    }

    loadStart() {
        this.oldCells = this.cellByKey;
        this.cellByKey = {};
    }

    loadEnd() {
        this.oldCells = null;
    }

    loadCell(ctx: CanvasRenderingContext2D, posX: number, posY: number, details: Record<string, any> = {}) {
        let key = `${posX}-${posY}`;
        let data;
        let cell;
        if (this.oldCells && this.oldCells.hasOwnProperty(key)) {
            cell = this.oldCells[key];
            this.cellByKey[key] = cell;
            delete this.oldCells[key];
        } else
            cell = this.cellByKey[key] ?? null;

        let isHover = 0;
        if (cell !== null && (details.isHover ?? false) && !(details.inLockX ?? false) && !(details.inLockY ?? false)) {
            if (posX === details.hoverX)
                isHover += 1;
            if (posY === details.hoverY)
                isHover += 2;
            if (isHover !== cell.isHover)
                cell = null;
        }

        if (cell === null) {
            data = this.dataSource.getData(posX, posY);

            cell = new KMCellText(
                ctx,
                data,
                this.cellDefaults,
                details,
                isHover,
            );
            this.cellByKey[key] = cell;
        }

        return cell;
    }
}

export {KMCellManager};