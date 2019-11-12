import Column from './Column';
import Record from './Record';


export default class TableFormatter {
    
    public getFormattedTable(records: Record[]): string {
        const columnLengths = this.getColumnLengths(records);
        const separatorRecord = this.buildSeparatorRecord(columnLengths);
        const separatorRecordLine = this.getFormattedRecord(separatorRecord, columnLengths, false);
        let result = '';

		// Write records
		for(var i = 0; i < records.length; i++) {
			const record = records[i];

			// Skip empty records
			if (record.getColumns().length === 0) {
				continue;
            }

            const formattedRecord = this.getFormattedRecord(record, columnLengths, true);
            result += separatorRecordLine + "\r\n";
            result += formattedRecord + "\r\n";
        }
        result += separatorRecordLine + "\r\n";
        
        return result;
    }

    private getColumnLengths(records: Record[]): any[] {
        let columnLengths = [];

        for (var i = 0; i < records.length; i++) {
            const record = records[i];
            const columns = record.getColumns();
            
            for (var colIdx = 0; colIdx < columns.length; colIdx++) {
                const len = columns[colIdx].getValue().length;

                if (columnLengths[colIdx] === undefined || len > columnLengths[colIdx]) {
                    columnLengths[colIdx] = len;
                }
            }
        }
        return columnLengths;
    }

    private buildSeparatorRecord(columnLengths: any[]): Record {
        const record = new Record();
        for (var i = 0; i < columnLengths.length; i++) {
            const colLength = columnLengths[i] + 2;
			const value = this.getRepeatedChar('-', colLength);

			record.pushColumn(new Column(value));
        }
        return record;
    }

    private getRepeatedChar(char: string, repeat: number): string {
		let result = '';

		for(var i = 0; i < repeat; i++) {
			result += char;
		}

		return result;
    }
    
    private getFormattedRecord(record: Record, columnLengths: any[], useValuePadding: boolean): string {
        const columns = record.getColumns();
		const ValuePadding = useValuePadding ? ' ' : '';
		const ColumnSeparator = '|';

        let result = '';
        
        for(var i = 0; i < columns.length; i++) {
			// Get column
			const column = columns[i];
			const value = column.getValue();
            const maxLen = columnLengths[i] + ValuePadding.length + ColumnSeparator.length;
            const rightPaddingLength = maxLen - (ValuePadding.length * 2) - value.length;

            if (i === 0) {
                result += ColumnSeparator;
            }
            result += ValuePadding;

			// Write value
            result += value;
            result += this.getRepeatedChar(' ', rightPaddingLength);
            result += ValuePadding;
            result += ColumnSeparator;
        }
        return result;
    }
}