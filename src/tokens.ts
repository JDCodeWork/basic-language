export interface IToken<T> {
    literal: T
    type: string

    line: number
    column: number
}

export class StrToken implements IToken<string> {
    public type = 'STR'

    constructor(
        public literal: string,
        public line: number,
        public column: number
    ) { }
}

export class NumToken implements IToken<number> {
    public type = 'NUM'
    public literal: number

    constructor(
        literal: string,
        public line: number,
        public column: number
    ) {
        this.literal = parseFloat(literal)
    }
}

export class BoolToken implements IToken<boolean> {
    public type = 'BOOL'
    public literal: boolean

    constructor(
        literal: string,
        public line: number,
        public column: number
    ) {
        if (literal == "0" || literal == 'False') {
            this.literal = false
        } else {
            this.literal = true
        }
    }
}

export class OpenRoundBracketToken implements IToken<string> {
    public type = 'OPEN_ROUND_BRACKET'
    public literal = '('

    constructor(
        public line: number,
        public column: number
    ) { }
}

export class CloseRoundBracketToken implements IToken<string> {
    public type = 'CLOSE_ROUND_BRACKET'
    public literal = ')'

    constructor(
        public line: number,
        public column: number
    ) { }
}

