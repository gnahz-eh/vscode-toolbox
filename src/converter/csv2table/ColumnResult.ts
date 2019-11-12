import Column from './Column';

export default class ColumnResult {

    private column: Column;
    private isTerminated: boolean;

    constructor(column: Column, isTerminated: boolean) {
        this.column = column;
        this.isTerminated = isTerminated;
    }

    public getColumn(): Column {
        return this.column;
    }

    public getIsTerminated(): boolean {
        return this.isTerminated;
    }
}