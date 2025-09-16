import type { IToken } from "./tokens"

export class Interpreter {
    private pc: number = 0
    private stack = new Stack(256)

    constructor(
        private tokens: IToken<any>[]
    ) { }

    interpret() {
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
            default:
                return;
        }

        console.log(this.stack)
        this.interpret()

    }

    private interpretEquality() {
        this.consume()

        const leftVal = this.stack.pop()
        const rightVal = this.consume().literal

        this.stack.push(leftVal == rightVal)
    }
    private interpretGreaterThan() {
        this.consume()

        const leftVal = this.stack.pop()

        if (this.current().type == "NUM") {
            const rightVal = this.consume().literal

            this.stack.push(leftVal >= rightVal)
        } else {
            throw new Error("Invalid comparison")
        }
    }
    private interpretLessThan() {
        this.consume()

        const leftVal = this.stack.pop()

        if (this.current().type == "NUM") {
            const rightVal = this.consume().literal

            this.stack.push(leftVal <= rightVal)
        } else {
            console.log(this.peek())
            throw new Error("Invalid comparison")
        }

        console.log(this.stack)
    }
    private interpretAnd() { }
    private interpretOr() { }
    private interpretNot() { }

    private consume() {
        if (this.pc >= this.tokens.length) {
            throw new Error("Unexpected end of input")
        }

        return this.tokens[this.pc++]
    }

    private current() {
        return this.tokens[this.pc]
    }

    private peek(amount = 1) {
        return this.tokens[this.pc + amount]
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
            throw new Error("Stack underflow")
        }

        return this.stack.shift()
    }
}