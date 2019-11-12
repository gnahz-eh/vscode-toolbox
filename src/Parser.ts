import Column from './Column';
import Record from './Record';
import ColumnResult from './ColumnResult';

export default class Parser {
    
    private text: string;
    private separator: string;
    private position: number;

    constructor(text: string, separator: string) {
        this.text = this.modifyText(text);
        this.separator = separator;
        this.position = 0;
    }

    private modifyText(text: string): string {
        if (!this.isNewLineChar(text[text.length - 1])) {
            text += '\r\n';
        }
        return text;
    }

    private isNewLineChar(char: string): boolean {
        return char === '\r' || char === '\n';
    }

    private isEof(): boolean {
        return this.position >= this.text.length;
    }

    public getRecords(): Record[] {
        let records: Record[] = [];
        let currentRecord: Record = new Record();
        
        records.push(currentRecord);

        while (!this.isEof()) {
            let columnResult: ColumnResult = this.readColumn();
            currentRecord.pushColumn(columnResult.getColumn());

            if (columnResult.getIsTerminated() && !this.isEof()) {
                currentRecord = new Record();
                records.push(currentRecord);
            }
        }

        return records;
    }

    private peekChar(): string {
        return this.text.substr(this.position, 1);
    }

    private readColumn(): ColumnResult {
        this.advanceToQuoteIfLeadingSpaces();

        let startPos = this.position;
        let isInQuote = false;
        let didTerminateRecord = false;
        let value = '';
        
        for (; this.position < this.text.length; this.position++) {
            const char = this.text[this.position];
            const nextChar = this.position + 1 < this.text.length ? this.text[this.position + 1] : null;
            const isSeparator = this.isSeparator(char);
            const isQuote = char === '"';
            const isNewLine = this.isNewLineChar(char);

            if (startPos === this.position && isQuote) {
                isInQuote = true;
                continue;
            }

            if (!isInQuote && (isSeparator || isNewLine)) {
                if (isNewLine) didTerminateRecord = true;
                break;
            }

            if (isInQuote && isQuote && nextChar === '"') {
                value += char;
                this.position++;
                continue;
            }

            if (isInQuote && isQuote && nextChar !== '"') {
				break;
			}
            value += char;
        }

        if (this.readPastSeparatorCharacter()) {
            didTerminateRecord = true;
        }

        const column = new Column(value);
        return new ColumnResult(column, didTerminateRecord);
    }
    

    private readPastSeparatorCharacter(): boolean {
		let didTerminateRecord = false;
		let didEncounterNonSeparatorOrNewLine = false;
        let initialPosition = this.position;
        
        while (!this.isEof()) {
            const char = this.peekChar();
            const isNewLine = this.isNewLineChar(char);
			const isSeparator = this.isSeparator(char);
            const isSeparatorOrNewLine = isSeparator || isNewLine;
            
            if (initialPosition === this.position && isSeparator) {
                this.position++;
                break;
            }

            if (isSeparatorOrNewLine) {
                if (isNewLine) {
                    didTerminateRecord = true;
                }

                if (didEncounterNonSeparatorOrNewLine && isSeparator) {
					break;
				}
                didEncounterNonSeparatorOrNewLine = true;
				this.position++;
				continue;
            }
            if (char === '"' && !didEncounterNonSeparatorOrNewLine) {
				this.position++;
				continue;
			}
            if (!didEncounterNonSeparatorOrNewLine) {
				this.position++;
				continue;
			}

			// Encountered non-separator
			break;
        }
        return didTerminateRecord;
    }

    /**
	 * Advance our position to the first quote, if one looks to exist amongst leading spaces
	 */
    private advanceToQuoteIfLeadingSpaces(): void {
        for (var i = this.position; i < this.text.length; i++) {
            const char = this.text[i];
            if (char === ' ') {
                continue;
            }

            if (char === '"') {
                this.position = i;
            }

            break;
        }
    }

    private isSeparator(char: string): boolean {
		return char === this.separator;
	}
}