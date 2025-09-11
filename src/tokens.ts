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

    constructor(
        public literal: number,
        public line: number,
        public column: number
    ) { }
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

export class EqualityToken implements IToken<string> {
    public type = 'EQUALITY'
    public literal = 'EQ'

    constructor(
        public line: number,
        public column: number
    ) { }
}

export class GreaterThanToken implements IToken<string> {
    public type = 'GREATER_THAN'
    public literal = 'GT'

    constructor(
        public line: number,
        public column: number
    ) { }
}

export class LessThanToken implements IToken<string> {
    public type = 'LESS_THAN'
    public literal = 'LT'

    constructor(
        public line: number,
        public column: number
    ) { }
}

export class AndToken implements IToken<string> {
    public type = 'AND'
    public literal = 'AND'

    constructor(
        public line: number,
        public column: number
    ) { }
}

export class OrToken implements IToken<string> {
    public type = 'OR'
    public literal = 'OR'

    constructor(
        public line: number,
        public column: number
    ) { }
}

export class NotToken implements IToken<string> {
    public type = 'NOT'
    public literal = 'NOT'

    constructor(
        public line: number,
        public column: number
    ) { }
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

