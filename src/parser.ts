import type { RawToken } from "./scanner";
import { BoolToken, NumToken, StrToken, type IToken } from "./tokens";

export class Parser {
    private tokens: IToken<any>[] = []
    private col = 0

    constructor(
        private rawTokens: RawToken[]
    ) { }

    parse() {
        while (this.rawTokens.length > this.col) {
            const currToken = this.rawTokens[this.col]

            switch (currToken.value) {
                case "BOOL":
                    this.bool(currToken)
                    break;
                case "STR":
                    this.str(currToken)
                    break;
                default:
                    this.col++
                    break;
            }

        }

        console.log(this.tokens)
    }

    bool(curr: RawToken) {
        const val = this.rawTokens[++this.col]
        const token = new BoolToken(val.value, curr.line, curr.column)

        this.tokens.push(token)
    }

    str(currToken: RawToken) {
        let strValue = ''

        let nextToken = this.rawTokens[++this.col]
        if (!nextToken.value.startsWith('(')) throw new Error('SYNTAX', { cause: "Invalid string" })

        while (!nextToken.value.endsWith(')')) {
            strValue += nextToken.value.replace('(', '') + " "
            nextToken = this.rawTokens[++this.col]
        }

        strValue += nextToken.value.replace(')', '')
        const token = new StrToken(strValue, currToken.line, currToken.column)

        this.tokens.push(token)
    }
}