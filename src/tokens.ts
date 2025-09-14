export interface IToken<T> {
    literal: T
    type: string

    line: number
    column: number
}


abstract class TokenBase<T> implements IToken<T> {
    abstract type: string

    constructor(
        public literal: T,
        public line: number,
        public column: number
    ) { }

    toString(): string {
        const typeCol = this.type.padEnd(20);
        const literalCol = String(this.literal ?? "").padStart(4).padEnd(20);
        const lineCol = String(this.line).padStart(4);
        const colCol = String(this.column).padStart(2, '0');

        return `${typeCol} | ${literalCol} | ${lineCol}:${colCol}`;
    }
}

export class StrToken extends TokenBase<string> {
    public type = 'STR'
}

export class NumToken extends TokenBase<number | null> {
    public type = 'NUM'
}

export class BoolToken extends TokenBase<boolean> {
    public type = 'BOOL'

    constructor(
        literal: string,
        line: number,
        column: number
    ) {
        let literalBol
        if (literal == "0" || literal == 'False') {
            literalBol = false
        } else {
            literalBol = true
        }

        super(literalBol, line, column)
    }
}

export class EqualityToken extends TokenBase<string> {
    public type = 'EQUALITY'

    constructor(
        line: number,
        column: number
    ) {
        super('EQ', line, column)
    }
}

export class GreaterThanToken extends TokenBase<string> {
    public type = 'GREATER_THAN'

    constructor(
        line: number,
        column: number
    ) {
        super('GT', line, column)
    }
}

export class LessThanToken extends TokenBase<string> {
    public type = 'LESS_THAN'

    constructor(
        line: number,
        column: number
    ) {
        super('LT', line, column)
    }
}

export class AndToken extends TokenBase<string> {
    public type = 'AND'

    constructor(
        line: number,
        column: number
    ) {
        super('AND', line, column)
    }
}

export class OrToken extends TokenBase<string> {
    public type = 'OR'

    constructor(
        line: number,
        column: number
    ) {
        super('OR', line, column)
    }
}

export class NotToken extends TokenBase<string> {
    public type = 'NOT'

    constructor(
        line: number,
        column: number
    ) {
        super('NOT', line, column)
    }
}

export class LeftParen extends TokenBase<null> {
    public type = 'LEFT_PAREN'

    constructor(
        line: number,
        column: number
    ) {
        super(null, line, column)
    }
}

export class RightParen extends TokenBase<null> {
    public type = 'RIGHT_PAREN'

    constructor(
        line: number,
        column: number
    ) {
        super(null, line, column)
    }
}

export class VarToken extends TokenBase<any> {
    public type = 'VAR'
}

export class IdentifierToken extends TokenBase<string> {
    public type = 'IDENT'
}

export class MacroToken extends TokenBase<string> {
    public type = 'MACRO'
}

export class JumpToken extends TokenBase<string> {
    public type = 'JUMP'
}

// TODO
export class SectionToken extends TokenBase<string> { 
    public type = 'SECTION'
}

export class IfToken extends TokenBase<null> {
    public type = 'IF'

    constructor(
        line: number,
        column: number
    ) {
        super(null, line, column)
    }
}

export class EndToken extends TokenBase<null> {
    public type = 'END'

    constructor(
        line: number,
        column: number
    ) {
        super(null, line, column)
    }
}