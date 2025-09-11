export interface RawToken {
    value: string
    line: number
    column: number
}

export class Scanner {
    static scan(source: string) {
        let currLine = 0
        let currCol = 0

        const rawTokens: RawToken[] = []
        const lines = source.trim().split('\n')

        for (const line of lines) {
            currLine++
            currCol = 0

            for (const word of line.split(' ')) {
                rawTokens.push({
                    value: word,
                    line: currLine,
                    column: currCol
                })

                currCol += word.length + 1
            }
        }

        return rawTokens
    }
}