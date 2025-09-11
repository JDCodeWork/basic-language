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
        const lines = this.source.trim().split('\n')

        for (const line of lines) {
            this.currLine++
            this.currCol = 0

            for (const word of line.split(' ')) {
                if (word == "#" ) {
                    break;
                }

                if(word.length == 0) continue;

                rawTokens.push({
                    value: word,
                    line: this.currLine,
                    column: this.currCol
                })

                this.currCol += word.length + 1
            }
        }

        return rawTokens
    }
}