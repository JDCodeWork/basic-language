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
      switch (this.curr().value) {
        case "BOOL":
          this.bool()
          break;
        case "STR":
          this.primitiveStr()
          break;
        default:
          if (this.curr().value.startsWith('"')) {
            this.str()
          } else this.consume()
          break;
      }
    }

    console.log(this.tokens)
  }

  private bool() {
    const dec = this.consume()
    const lit = this.consume()

    const token = new BoolToken(lit.value, dec.line, dec.column)

    this.tokens.push(token)
  }

  private str() {
    // Check correct syntax
    if (!this.curr().value.startsWith('"')) {
      throw new Error('SYNTAX', { cause: `Invalid string at ${this.curr().line}:${this.curr().column}. String must be start with: " ` })
    }

    let strValue = ''
    const startToken = this.curr()

    // Sanitize string
    while (!this.curr().value.endsWith('"')) {
      let rawVal = this.consume().value

      if (rawVal.endsWith('"')) rawVal = rawVal.replace('"', '')

      strValue += rawVal + " "
    }

    // Sanitize end string
    strValue += this.consume().value.replace(')', '')
    const token = new StrToken(strValue, startToken.line, startToken.column)

    this.tokens.push(token)
  }

  private primitiveStr() {
    if (this.curr().value == "STR") this.consume()

    if (!this.curr().value.startsWith('(')) {
      throw new Error('SYNTAX', { cause: `Invalid string at ${this.curr().line}:${this.curr().column}. String must be start with: (` })
    }

    let strValue = ''
    const startToken = this.curr()

    while (!this.curr().value.endsWith(')')) {
      let rawVal = this.consume().value

      if (rawVal.startsWith('(')) rawVal = rawVal.replace('(', '')

      strValue += rawVal + " "
    }

    strValue += this.consume().value.replace(')', '')
    const token = new StrToken(strValue, startToken.line, startToken.column)

    this.tokens.push(token)
  }

  private next() {
    return this.rawTokens[this.col + 1]
  }

  private prev() {
    return this.rawTokens[this.col + 1]
  }

  private consume() {
    return this.rawTokens[this.col++]
  }

  private curr() {
    return this.rawTokens[this.col]
  }
}