import Column from './Column';

export default class Record {
    private columns: Column[] = [];

    public pushColumn(column: Column) {
        this.columns.push(column);
    } 

    public getColumns(): Column[] {
        return this.columns;
    }
}