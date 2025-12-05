class KMDataSource
{
    constructor(data = []) {
        this.data = data;
    }

    getNumRows() {
        return this.data.length;
    }

    getNumColumns() {
        if (this.data && this.data.length > 0)
            return this.data[0].length;
        else
            return 0;
    }

    getData(iColumn, iRow)
    {
        return {
            value: this.data[iRow][iColumn],
            type: 'string',
            dataSource: this,
            x:iColumn,
            y:iRow,
            details: {
            }
        };
    }
}