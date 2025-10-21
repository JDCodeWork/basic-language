import type { Token } from "./utils/tokens"

export class Scanner {
    private line = 0
    private column = 0
    private counter = 0

    private tokens: Token[] = []

    constructor(
        private source: string
    ) { }

    scan() {
        let word = ""

        while (this.counter <= this.source.length) {
            const char = this.consume()

            if (char == ' ') {
                console.log(word)
                word = ""
                continue
            }

            word += char
        }
    }


    check(char: string) {
        return char == this.source.charAt(this.counter + 1)
    }

    peek() {
        return this.source.charAt(this.counter + 1)
    }

    consume() {
        const char = this.source.charAt(this.counter)

        if (char == '\n') {
            this.line++
            this.column = 0
        }

        this.column++
        this.counter++

        return char
    }

    getTokens() {
        return this.tokens
    }
}