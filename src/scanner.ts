export interface RawToken {
    value: string
    line: number
    column: number
}

export class Scanner {
    private currLine = 0
    private currCol = 0

    constructor(
        private source: string
    ) { }

    scan() {
        const rawTokens: RawToken[] = []
        const lines = this.source.split('\n')

        for (const line of lines) {
            this.currLine++
            this.currCol = 0

            for (const word of line.split(' ')) {
                // If a comment is encountered, skip the rest of the line.
                if (word == "#") break;

                // Skip empty words (which can occur with multiple spaces)
                if (word.length == 0) continue;

                // Calculate column considering leading whitespace and tabs
                this.currCol = line.indexOf(word, this.currCol);

                rawTokens.push({
                    value: word,
                    line: this.currLine,
                    column: this.currCol
                })

                // Move to the position after the current word and space
                this.currCol += word.length + 1;
            }
        }

        return rawTokens
    }
}