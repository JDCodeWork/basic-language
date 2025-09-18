import type { IToken } from "./tokens"
import { RuntimeError, SemanticError } from "./utils"

export class Interpreter {
    private pc: number = 0
    private stack = new Stack(256)

    constructor(
        private tokens: IToken<any>[]
    ) { }

    interpret() {
        while (!this.isAtEnd()) {
            this.interpretToken()
        }

        console.log(this.stack)
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
            case "GREATER_THAN":
                this.interpretGreaterThan()
                break;
            case "LESS_THAN":
                this.interpretLessThan()
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
            default:
                this.consume()
                break;
        }
    }

    private interpretEquality() {
        this.consume()

        if (this.previous(2).type == "NUM" && this.peek().type == "NUM") {
            const leftVal = this.stack.pop()
            const rightVal = this.consume().literal

            this.stack.push(leftVal == rightVal)
            return
        }

        // throw new SemanticError(`The 'EQ' operator cannot be used to compare values of different or incompatible types. Error at ${this.previous().line}:${this.previous().column}`)
    }
    private interpretGreaterThan() {
        this.consume()

        const leftVal = this.stack.pop()

        if (this.current().type == "NUM") {
            const rightVal = this.consume().literal

            this.stack.push(leftVal >= rightVal)
            return
        }

        // throw new SemanticError(`The 'GT' operator cannot be used to compare values of different or incompatible types. Error at ${this.previous().line}:${this.previous().column}`)
    }
    private interpretLessThan() {
        this.consume()

        const leftVal = this.stack.pop()

        if (this.current().type == "NUM") {
            const rightVal = this.consume().literal

            this.stack.push(leftVal <= rightVal)
            return
        }

        // throw new SemanticError(`The 'LT' operator cannot be used to compare values of different or incompatible types. Error at ${this.previous().line}:${this.previous().column}`)
    }
    private interpretAnd() {
        this.consume()
        const leftVal = this.stack.pop()
        const rightTok = this.consume()

        if (typeof leftVal === "boolean" && rightTok.type == "BOOL") {
            this.stack.push(leftVal && rightTok.literal)
            return
        }

        // throw new SemanticError(`The 'AND' operator cannot be used with different or incompatible types. Ensure both operands are of the same type. Error at ${this.previous().line}:${this.previous().column}`)
    }
    private interpretOr() {
        this.consume()
        const leftVal = this.stack.pop()
        const rightTok = this.consume()

        if (typeof leftVal === "boolean" && rightTok.type == "BOOL") {
            this.stack.push(leftVal || rightTok.literal)
            return
        }

        // throw new SemanticError(`The 'OR' operator cannot be used with different or incompatible types. Ensure both operands are of the same type. Error at ${this.previous().line}:${this.previous().column}`)
    }

    private interpretNot() {
        this.consume()
        const rightTok = this.consume()

        if (rightTok.type === "BOOL") {
            this.stack.push(!rightTok.literal)
            return
        }

        // throw new SemanticError(`The 'NOT' operator requires a single operand of a valid type. Ensure the operand is of the correct type. Error at ${this.previous().line}:${this.previous().column}`)
    }

    private consume() {
        if (this.isAtEnd()) {
            throw new RuntimeError("Unexpected end of input")
        }

        return this.tokens[this.pc++]
    }

    private current() {
        return this.tokens[this.pc]
    }

    private peek(amount = 1) {
        return this.tokens[this.pc + amount]
    }

    private previous(amount = 1) {
        return this.tokens[this.pc - amount]
    }

    private isAtEnd() {
        return this.pc >= this.tokens.length
    }
}

class Stack {
    private stack: any[] = []

    constructor(private size: number) { }

    push(value: any) {
        if (this.stack.length >= this.size) {
            throw new Error("Stack overflow")
        }

        this.stack.push(value)
    }

    pop() {
        if (this.stack.length === 0) {
            throw new Error("Stack underflow")
        }

        return this.stack.pop()
    }

    shift() {
        if (this.stack.length === 0) {
            throw new RuntimeError("Stack underflow")
        }

        return this.stack.shift()
    }
}