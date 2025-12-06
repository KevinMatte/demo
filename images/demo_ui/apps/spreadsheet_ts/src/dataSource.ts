import {KMDataSource} from "./canvas/KMDataSource.ts";

class DataSource extends KMDataSource
{
    numColumns: number;
    numRows: number;

    constructor(numColumns: number, numRows: number) {
        super([]);

        this.numColumns = numColumns;
        this.numRows = numRows;
    }

    getNumRows() {
        return this.numRows;
    }

    getNumColumns() {
        return this.numColumns;
    }

    getData(iColumn: number, iRow: number)
    {
        let value: number | string = iRow * this.numColumns + iColumn;
        if (iColumn === 0 || iRow === 0)
            value = `Label: ${value}`;
        else if ((iColumn) % 2 === 1)
            value = '' + value;

        return {
            value,
            type: 'string',
            dataSource: this,
            x:iColumn,
            y:iRow,
            details: {
            }
        };
    }
}

export {DataSource}