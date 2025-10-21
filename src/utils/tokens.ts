enum TokenType {
    String = "STR",
    Number = "NUM",
    Boolean = "BOOL",

    Equality = "EQ",
    Greater = "GT",
    GreaterEqual = "GTE",
    Less = "LT",
    LessEqual = "LTE",

    And = "AND",
    Or = "OR",
    Not = "NOT",

    LeftParen = "(",
    RightParen = ")",

    Var = "VAR",
    Ident = "INDENT",

    If = "IF",
    Section = "SECTION",
    Loop = "LOOP", // TODO
    Break = "BREAK", // TODO
    End = "END",

    Exit = "EXIT", // TODO
}

export class Token {
    constructor(
        public type: TokenType,
        public lexeme: any,
        public line: number,
        public column: number
    ) { }

    toString(): string {
        const typeCol = this.type.padEnd(20);
        const literalCol = String(this.lexeme ?? "").padStart(4).padEnd(20);
        const lineCol = String(this.line).padStart(4);
        const colCol = String(this.column).padStart(2, '0');

        return `${typeCol} | ${literalCol} | ${lineCol}:${colCol}`;
    }
}