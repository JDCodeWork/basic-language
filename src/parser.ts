import type { RawToken } from "./scanner";
import { AndToken, BoolToken, RightParen, EndToken, EqualityToken, GreaterToken, IdentifierToken, IfToken, JumpToken, LessToken, MacroToken, NotToken, NumToken, LeftParen, OrToken, SectionToken, StrToken, VarToken, type IToken, GreaterEqual as GreaterEqualToken, LessEqual as LessEqualToken } from "./tokens";

const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/

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
        if (isNaN(Number(this.nextTok().value))) {
          this.consume()
          this.tokens.push(new NumToken(null, this.currTok().line, this.currTok().column))
        } else this.parsePrimitiveNum()
        break;
      case "EQ":
        this.consume()
        this.tokens.push(new EqualityToken(this.currTok().line, this.currTok().column))
        break;
      case "GT":
        this.consume()
        this.tokens.push(new GreaterToken(this.currTok().line, this.currTok().column))
        break;
      case "GTE":
        this.consume()
        this.tokens.push(new GreaterEqualToken(this.currTok().line, this.currTok().column))
        break;
      case "LT":
        this.consume()
        this.tokens.push(new LessToken(this.currTok().line, this.currTok().column))
        break;
      case "LTE":
        this.consume()
        this.tokens.push(new LessEqualToken(this.currTok().line, this.currTok().column))
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
      case "ASSIGN":
      case "TO":
        this.tokens.push(new VarToken(this.currTok().value, this.currTok().line, this.currTok().column))
        this.consume()
        break;
      case "READ":
      case "PRINT":
      case "ADD":
      case "DIV":
      case "MUL":
      case "SUB":
      case "EXIT":
        this.tokens.push(new MacroToken(this.currTok().value, this.currTok().line, this.currTok().column))
        this.consume()
        break;
      case "IF":
        this.tokens.push(new IfToken(this.currTok().line, this.currTok().column))
        this.consume()
        break;
      case "END":
        this.tokens.push(new EndToken(this.currTok().line, this.currTok().column))
        this.consume()
        break;
      case "JUMP":
        this.parseJump()
        break;
      case "SECTION":
        this.parseSection()
        break;
      default:
        this.splitRawTokens()
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
      throw new SyntaxError(`Invalid string at ${this.currTok().line}:${this.currTok().column}. String must be start with: " `)
    }

    let strValue = ''
    const startToken = this.currTok()

    // Sanitize string
    while (!this.currTok().value.endsWith('"')) {
      let rawVal = this.consume().value

      if (rawVal.startsWith('"')) rawVal = rawVal.slice(0, rawVal.length - 1).replaceAll('"', '')

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
      throw new SyntaxError(`Invalid string at ${this.currTok().line}:${this.currTok().column}. String must be start with: (`)
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
      throw new SyntaxError(`Invalid number at ${this.currTok().line}:${this.currTok().column}.`)
    }

    const token = new NumToken(numVal, numToken.line, numToken.column)

    this.tokens.push(token)
  }

  private splitRawTokens() {
    const currTokVal = this.currTok().value

    if (currTokVal.startsWith('"')) { // Modern Strings
      this.parseStr()
    } else if (!isNaN(Number(currTokVal))) { // Modern Numbers
      this.parseNum()
    } else if (currTokVal.startsWith('(')) { // Start Group expression
      this.splitOpenRoundBracket()
    } else if (currTokVal.endsWith(')')) { // End Group expression
      this.splitCloseRoundBracket()
    } else if (IDENTIFIER_REGEX.test(currTokVal)) { // Any identifier
      this.tokens.push(new IdentifierToken(currTokVal, this.currTok().line, this.currTok().column))
      this.consume()
    } else this.consume() // Unknown Tokens
  }

  private splitOpenRoundBracket() {
    this.tokens.push(new LeftParen(this.currTok().line, this.currTok().column))

    const rest = this.currTok().value.split('').slice(1)
    this.consume()

    if (rest.length > 0) {
      const rawToken = { column: this.col, line: this.currTok().line, value: rest.join('') }
      this.rawTokens.splice(this.col, 0, rawToken)
    }
  }

  private splitCloseRoundBracket() {
    const rest = this.currTok().value.split('').slice(0, -1)

    if (rest.length > 0) {
      const rawToken = { column: this.col, line: this.currTok().line, value: rest.join('') }
      this.rawTokens.splice(this.col, 0, rawToken)
      this.parseToken()
    }

    this.tokens.push(new RightParen(this.currTok().line, this.currTok().column))
    this.consume()
  }

  private parseJump() {
    const prevTok = this.consume()

    if (!IDENTIFIER_REGEX.test(this.currTok().value)) {
      throw new SyntaxError(`Invalid jump label at ${this.currTok().line}:${this.currTok().column}.`)
    }

    this.tokens.push(new JumpToken(this.currTok().value, prevTok.line, prevTok.column))
    this.consume()
  }

  private parseSection() {
    const prevTok = this.consume()

    const sectionLabel = this.currTok().value.split(':')[0]

    if (!IDENTIFIER_REGEX.test(sectionLabel)) {
      throw new SyntaxError(`Invalid section label at ${this.currTok().line}:${this.currTok().column}.`)
    }

    this.tokens.push(new SectionToken(sectionLabel, prevTok.line, prevTok.column))
    this.consume()
  }

  private consume() {
    return this.rawTokens[this.col++]
  }

  private currTok() {
    return this.rawTokens[this.col]
  }

  private nextTok() {
    return this.rawTokens[this.col + 1]
  }

  private isAtEnd() {
    return this.col >= this.rawTokens.length
  }
}

