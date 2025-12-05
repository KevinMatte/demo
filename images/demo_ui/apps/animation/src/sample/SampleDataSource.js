class SampleDataSource
{
    constructor(numColumns, numRows) {
        this.numColumns = numColumns;
        this.numRows = numRows;
    }

    getNumRows() {
        return this.numRows;
    }

    getNumColumns() {
        return this.numColumns;
    }

    getData(iColumn, iRow)
    {
        let value = iRow * this.numColumns + iColumn;
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