import type { RawToken } from "./scanner";
import { AndToken, BoolToken, CloseRoundBracketToken, EqualityToken, GreaterThanToken, LessThanToken, NotToken, NumToken, OpenRoundBracketToken, OrToken, StrToken, type IToken } from "./tokens";

export class Parser {
  private tokens: IToken<any>[] = []
  private col = 0

  constructor(
    private rawTokens: RawToken[]
  ) { }

  parse() {
    while (!this.isAtEnd()) {
      this.parseToken()
    }

    return this.tokens
  }

  private parseToken() {
    switch (this.currTok().value) {
      case "BOOL":
      case "True":
      case "False":
        this.parseBool()
        break;
      case "STR":
        this.parsePrimitiveStr()
        break;
      case "NUM":
        this.parsePrimitiveNum()
        break;
      case "EQ":
        this.consume()
        this.tokens.push(new EqualityToken(this.currTok().line, this.currTok().column))
        break;
      case "GT":
        this.consume()
        this.tokens.push(new GreaterThanToken(this.currTok().line, this.currTok().column))
        break;
      case "LT":
        this.consume()
        this.tokens.push(new LessThanToken(this.currTok().line, this.currTok().column))
        break;
      case "NOT":
        this.consume()
        this.tokens.push(new NotToken(this.currTok().line, this.currTok().column))
        break;
      case "AND":
        this.consume()
        this.tokens.push(new AndToken(this.currTok().line, this.currTok().column))
        break;
      case "OR":
        this.consume()
        this.tokens.push(new OrToken(this.currTok().line, this.currTok().column))
        break;
      default:
        const currTokVal = this.currTok().value

        if (currTokVal.startsWith('"')) {
          this.parseStr()
        } else if (!isNaN(Number(currTokVal))) {
          this.parseNum()
        } else if (currTokVal.startsWith('(')) {
          this.tokens.push(new OpenRoundBracketToken(this.currTok().line, this.currTok().column))
          this.consume()

          const rest = currTokVal.split('').slice(1)

          if (rest.length >= 1) {
            const rawToken = { column: this.col, line: this.currTok().line, value: rest.join() }
            this.rawTokens.splice(this.col, 0, rawToken)
          }
        } else if (currTokVal.endsWith(')')) {
          const rest = currTokVal.split('').slice(0, -1)

          if (rest.length >= 1) {
            const rawToken = { column: this.col, line: this.currTok().line, value: rest.join() }
            this.rawTokens.splice(this.col, 0, rawToken)
            this.parseToken()
          }

          this.tokens.push(new CloseRoundBracketToken(this.currTok().line, this.currTok().column))
          this.consume()
        } else this.consume()

        break;
    }
  }

  private parseBool() {
    if (this.currTok().value == "BOOL") this.consume()
    const lit = this.consume()

    const token = new BoolToken(lit.value, lit.line, lit.column)
    this.tokens.push(token)
  }

  private parseStr() {
    // Check correct syntax
    if (!this.currTok().value.startsWith('"')) {
      throw new Error('SYNTAX', { cause: `Invalid string at ${this.currTok().line}:${this.currTok().column}. String must be start with: " ` })
    }

    let strValue = ''
    const startToken = this.currTok()

    // Sanitize string
    while (!this.currTok().value.endsWith('"')) {
      let rawVal = this.consume().value

      if (rawVal.startsWith('"')) rawVal = rawVal.replace('"', '')

      strValue += rawVal + " "
    }

    // Sanitize end string
    strValue += this.consume().value.replace('"', '')
    const token = new StrToken(strValue, startToken.line, startToken.column)

    this.tokens.push(token)
  }

  private parseNum() {
    const numToken = this.consume()
    const numVal = parseFloat(numToken.value)

    const token = new NumToken(numVal, numToken.line, numToken.column)

    this.tokens.push(token)
  }

  private parsePrimitiveStr() {
    if (this.currTok().value == "STR") this.consume()

    // Check correct syntax
    if (!this.currTok().value.startsWith('(')) {
      throw new Error('SYNTAX', { cause: `Invalid string at ${this.currTok().line}:${this.currTok().column}. String must be start with: (` })
    }

    let strValue = ''
    const startToken = this.currTok()

    // Sanitize string
    while (!this.currTok().value.endsWith(')')) {
      let rawVal = this.consume().value

      if (rawVal.startsWith('(')) rawVal = rawVal.replace('(', '')

      strValue += rawVal + " "
    }

    // Sanitize end string
    strValue += this.consume().value.replace(')', '')
    const token = new StrToken(strValue, startToken.line, startToken.column)

    this.tokens.push(token)
  }

  private parsePrimitiveNum() {
    if (this.currTok().value == "NUM") this.consume()

    // Check correct syntax
    const numToken = this.consume()
    const numVal = parseFloat(numToken.value)

    if (isNaN(numVal)) {
      throw new Error('SYNTAX', { cause: `Invalid number at ${this.currTok().line}:${this.currTok().column}.` })
    }

    const token = new NumToken(numVal, numToken.line, numToken.column)

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

  private currTok() {
    return this.rawTokens[this.col]
  }

  private isAtEnd() {
    return this.col >= this.rawTokens.length
  }
}