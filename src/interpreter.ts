import { type IToken } from "./utils/tokens"
import { RuntimeError, SemanticError } from "./utils/errors"

export class Interpreter {
    private pc: number = 0

    private stack = new Stack(32)
    private variables: Record<string, any> = {}
    private flowControl: Record<string, Partial<{ start: number, end: number }>> = {}

    constructor(
        private tokens: IToken<any>[]
    ) { }

    interpret() {
        while (!this.isAtEnd()) {
            this.interpretToken()
        }
    }

    private interpretToken() {
        switch (this.current().type) {
            case "STR":
            case "NUM":
            case "BOOL":
                this.stack.push(this.consume().literal)
                break;
            case "EQUALITY":
                this.interpretEquality()
                break;
            case "GREATER":
                this.interpretGreater()
                break;
            case "LESS":
                this.interpretLess()
                break;
            case "GREATER_EQUAL":
                this.interpretGreaterEqual()
                break;
            case "LESS_EQUAL":
                this.interpretLessEqual()
                break;
            case "AND":
                this.interpretAnd()
                break;
            case "OR":
                this.interpretOr()
                break;
            case "NOT":
                this.interpretNot()
                break;
            case "MACRO":
                this.interpretMacro()
                break;
            case "VAR":
                this.interpretVar()
                break;
            case "JUMP":
                this.interpretJump()
                break;
            case "SECTION":
                this.readSection()
                break;
            case "IF":
                this.interpretIf()
                break;
            default:
                this.consume() // Ignore other tokens for now
                break;
        }
    }

    private interpretEquality() {
        this.consume() // Consume 'EQUALITY' token

        const { leftVal, rightVal } = this.getBinaryValues()

        if (typeof leftVal !== typeof rightVal) {
            throw new SemanticError(`Cannot compare values of different types: '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal == rightVal)
    }

    private interpretGreater() {
        this.consume() // Consume 'GREATER' token

        const { leftVal, rightVal } = this.getBinaryValues()

        if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
            throw new SemanticError(`Operator 'GT' can only be applied to numbers, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal > rightVal)
    }

    private interpretGreaterEqual() {
        this.consume() // Consume 'GREATER_EQUAL' token

        const { leftVal, rightVal } = this.getBinaryValues()

        if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
            throw new SemanticError(`Operator 'GTE' can only be applied to numbers, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal >= rightVal)
    }

    private interpretLess() {
        this.consume() // Consume 'LESS' token

        const { leftVal, rightVal } = this.getBinaryValues()

        if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
            throw new SemanticError(`Operator 'LT' can only be applied to numbers, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal < rightVal)
    }

    private interpretLessEqual() {
        this.consume() // Consume 'LESS_EQUAL' token

        const { leftVal, rightVal } = this.getBinaryValues()

        if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
            throw new SemanticError(`Operator 'LTE' can only be applied to numbers, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal <= rightVal)
    }

    private interpretAnd() {
        this.consume() // Consume 'AND' token

        const { leftVal, rightVal } = this.getBinaryValues()

        if (typeof leftVal !== 'boolean' || typeof rightVal !== 'boolean') {
            throw new SemanticError(`Logical 'AND' operator can only be applied to booleans, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal && rightVal)
    }

    private interpretOr() {
        this.consume() // Consume 'OR' token

        const { leftVal, rightVal } = this.getBinaryValues()

        if (typeof leftVal !== 'boolean' || typeof rightVal !== 'boolean') {
            throw new SemanticError(`Logical 'OR' operator can only be applied to booleans, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal || rightVal)
    }

    private interpretNot() {
        this.consume() // Consume 'NOT' token

        if (this.current().type === "EQUALITY") {
            return this.interpretNotEq()
        }

        let rightVal
        if (this.current().type == "IDENT") rightVal = this.variables[this.current().literal]
        else rightVal = this.evaluateExpression()

        if (typeof rightVal !== 'boolean') {
            throw new SemanticError(`Logical 'NOT' operator can only be applied to booleans, but got '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(!rightVal)
    }

    private interpretNotEq() {
        this.consume(); // consume 'EQUALITY'

        const { leftVal, rightVal } = this.getBinaryValues()

        if (typeof leftVal !== typeof rightVal) {
            throw new SemanticError(`Cannot compare values of different types for inequality: '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal != rightVal)
    }

    private interpretVar() {
        const varAssignTok = this.consume()

        if (varAssignTok.literal != "ASSIGN") {
            throw new SyntaxError(`Expected 'ASSIGN' before variable name, but got '${varAssignTok.type}'. Error at ${varAssignTok.line}:${varAssignTok.column}`);
        }

        const value = this.evaluateValue()

        const varToTok = this.consume()
        if (varToTok.type != "VAR" || varToTok.literal != "TO") {
            throw new SyntaxError(`Expected 'TO' after variable name, but got '${varToTok.type}'. Error at ${varToTok.line}:${varToTok.column}`);
        }

        const varNameTok = this.consume()
        if (varNameTok.type != "IDENT") {
            throw new SyntaxError(`Expected variable name, but got '${varNameTok.type}'. Error at ${varNameTok.line}:${varNameTok.column}`);
        }

        this.variables[varNameTok.literal] = value
    }

    private interpretMacro() {
        switch (this.current().literal) {
            case "ADD":
                this.interpretAddMarco()
                break;
            case "SUB":
                this.interpretSubMacro()
                break;
            case "MUL":
                this.interpretMulMacro()
                break;
            case "DIV":
                this.interpretDivMacro()
                break;
            case "READ":
                this.interpretReadMacro()
                break;
            case "PRINT":
                this.interpretPrintMacro()
                break;
            case "EXIT":
                this.interpretExitMacro()
                break;
            default:
                this.consume()
                break;
        }
    }

    private interpretAddMarco() {
        this.consume()

        let leftVal = this.evaluateValue()
        const rightVal = this.evaluateValue()

        this.stack.push(leftVal + rightVal)
    }

    private interpretSubMacro() {
        this.consume()

        const leftVal = this.evaluateValue()
        const rightVal = this.evaluateValue()

        if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
            throw new SemanticError(`Operator 'ADD' can only be applied to numbers, but got '${typeof leftVal.literal}' and '${typeof rightVal.literal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal - rightVal)
    }

    private interpretMulMacro() {
        this.consume()

        const leftVal = this.evaluateValue()
        const rightVal = this.evaluateValue()

        if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
            throw new SemanticError(`Operator 'ADD' can only be applied to numbers, but got '${typeof leftVal.literal}' and '${typeof rightVal.literal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal * rightVal)
    }

    private interpretDivMacro() {
        this.consume()

        const leftVal = this.evaluateValue()
        const rightVal = this.evaluateValue()

        if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
            throw new SemanticError(`Operator 'ADD' can only be applied to numbers, but got '${typeof leftVal.literal}' and '${typeof rightVal.literal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal / rightVal)
    }

    private interpretReadMacro() {
        this.consume()

        let castType = "STR"
        if (this.current().literal == null && (this.current().type == "STR" || this.current().type == "NUM" || this.current().type == "BOOL")) {
            castType = this.current().type
            this.consume()
        }

        let promptText = ""
        if (this.current().type == "AND" && this.next().literal == "PRINT") {
            this.consume()
            this.consume()

            promptText = this.consume().literal
        }


        const val = prompt(promptText)
        switch (castType) {
            case "STR":
                this.stack.push(val)
                break;
            case "NUM":
                this.stack.push(Number(val))
                break;
            case "BOOL":
                this.stack.push(val == "True" ? true : false)
                break;
            default:
                this.stack.push(null)
                break;
        }
    }

    private interpretPrintMacro() {
        this.consume()

        let printText = ""
        while (this.current() && this.current().line == this.previous().line) {
            printText += this.evaluateValue()
        }

        console.log(printText)
    }

    private interpretExitMacro() {
        this.consume()

        const exitCode = this.evaluateValue()
        process.exit(exitCode ?? 0)
    }

    private interpretJump() {
        const label = this.consume().literal

        if (this.flowControl[label]) {
            throw new SemanticError(`Label '${label}' already defined. Error at ${this.current().line}:${this.current().column}`);
        }

        if (this.consume().type != "IF")
            throw new SyntaxError(`Expected 'IF' after jump label, but got '${this.current().type}'. Error at ${this.current().line}:${this.current().column}`);

        const boolVal = this.evaluateExpression()
        if (!boolVal) return

        this.flowControl[label] = { start: undefined, end: undefined }
        while (!(this.current().literal == label && this.current().type == "SECTION")) {
            if (this.isAtEnd())
                throw new RuntimeError("Unmatched jump. Unexpected end of input.")

            this.consume()
        }

        this.interpretSection()
    }

    private interpretSection() {
        const sectionLabel = this.consume().literal

        this.flowControl[sectionLabel] = {
            start: this.pc,
            end: undefined
        }

        while (this.current().type != "END") {
            if (this.isAtEnd())
                throw new RuntimeError("Unmatched section. Unexpected end of input.")

            this.interpretToken()
        }

        this.flowControl[sectionLabel].end = this.pc
    }

    private readSection() {
        const sectionTok = this.consume()

        this.flowControl[sectionTok.literal] = {
            start: this.pc,
            end: undefined
        }

        while (!(this.current().type == "END" && sectionTok.column == this.current().column)) {
            if (this.isAtEnd())
                throw new RuntimeError("Unmatched section. Unexpected end of input.")

            this.consume()
        }

        this.flowControl[sectionTok.literal].end = this.pc
    }

    // FIXME: This is not working correctly when has something like ((1 EQ 0) OR (2 LT 1))
    private interpretIf() {
        const ifTok = this.consume()

        const boolVal = this.evaluateExpression()

        if (!boolVal) {
            while (this.current().type != "END" && ifTok.column != this.current().column) {
                if (this.isAtEnd())
                    throw new RuntimeError("Unmatched if. Unexpected end of input.")

                this.consume()
            }

            return
        }

        while (this.current().type != "END" && ifTok.column != this.current().column) {
            if (this.isAtEnd())
                throw new RuntimeError("Unmatched if. Unexpected end of input.")

            this.interpretToken()
        }
    }

    private evaluateValue() {
        const tokType = this.current().type

        if (tokType == "MACRO") {
            this.interpretMacro()

            return this.stack.pop()
        }

        if (tokType == "LEFT_PAREN") {
            return this.evaluateExpression()
        }

        if (tokType != "IDENT") return this.consume().literal

        const varName = String(this.consume().literal)
        if (varName.length != 1 && !varName.startsWith('S')) {
            const varVal = this.variables[varName]

            if (varVal == undefined)
                throw new SemanticError(`Variable '${varName}' is not defined. Error at ${this.previous().line}:${this.previous().column}`)

            return varVal
        }

        return this.stack.pop()
    }

    private evaluateExpression() {
        if (this.consume().type != "LEFT_PAREN")
            return this.previous().literal

        if (this.current().type == "LEFT_PAREN") {
            const val = this.evaluateExpression()
            this.stack.push(val)
        }

        while (this.current().type != "RIGHT_PAREN") {
            if (this.isAtEnd()) {
                throw new RuntimeError("Unmatched parenthesis. Unexpected end of input.")
            }
            this.interpretToken()
        }

        this.consume() // consume RIGHT_PAREN
        return this.stack.pop()
    }

    private getBinaryValues() {
        let leftVal
        if (this.previous(2).type == "IDENT") leftVal = this.variables[this.previous(2).literal]
        else leftVal = this.stack.pop()

        let rightVal
        if (this.current().type == "IDENT") rightVal = this.variables[this.current().literal]
        else rightVal = this.evaluateExpression()

        return { leftVal, rightVal }
    }

    private consume() {
        if (this.isAtEnd()) {
            throw new RuntimeError("Unexpected end of input.")
        }

        return this.tokens[this.pc++]
    }

    private current() {
        return this.tokens[this.pc]
    }

    private previous(amount = 1) {
        return this.tokens[this.pc - amount]
    }

    private next(amount = 1) {
        return this.tokens[this.pc + amount]
    }

    private isAtEnd() {
        return this.pc >= this.tokens.length;
    }
}

class Stack {
    private stack: any[] = []

    constructor(private size: number) { }

    push(value: any) {
        if (this.stack.length >= this.size) {
            throw new RuntimeError("Stack overflow: Maximum stack size of " + this.size + " exceeded.")
        }

        this.stack.push(value)
    }

    pop() {
        if (this.stack.length === 0) {
            throw new RuntimeError("Stack underflow: Cannot pop from an empty stack.")
        }

        return this.stack.pop()
    }

    shift() {
        if (this.stack.length === 0) {
            throw new RuntimeError("Stack underflow: Cannot shift from an empty stack.")
        }

        return this.stack.shift()
    }

    toString() {
        let str = 'Stack (Top to Bottom):\n['

        if (this.stack.length === 0) {
            str += '\n    (empty)\n'
        } else {
            for (let i = this.stack.length - 1; i >= 0; i--) {
                str += `\n    ${i}: ${JSON.stringify(this.stack[i])} `
            }
        }

        str += '\n] Size: ' + this.stack.length + ' / ' + this.size + ''
        return str
    }
}
