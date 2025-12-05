class KMCellManager {
    dataSource;
    cellByKey = {};
    oldCells = null;
    cellDefaults = {padding: 4};

    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    getCell(posX, posY) {
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

    loadCell(ctx, posX, posY, details = {}) {
        let key = `${posX}-${posY}`;
        let data;
        let cell;
        if (this.oldCells.hasOwnProperty(key)) {
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
