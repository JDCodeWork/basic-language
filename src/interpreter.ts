import { type IToken } from "./tokens"
import { RuntimeError, SemanticError } from "./utils"

export class Interpreter {
    private pc: number = 0
    private stack = new Stack(32)

    constructor(
        private tokens: IToken<any>[]
    ) { }

    interpret() {
        while (!this.isAtEnd()) {
            this.interpretToken()
        }

        console.log(this.stack.toString())
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
                this.consume() // Ignore other tokens for now
                break;
        }
    }

    private interpretEquality() {
        this.consume() // Consume 'EQUALITY' token

        const leftVal = this.stack.pop()
        const rightVal = this.evaluateExpression()

        if (typeof leftVal !== typeof rightVal) {
            throw new SemanticError(`Cannot compare values of different types: '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal == rightVal)
    }

    private interpretGreaterThan() {
        this.consume() // Consume 'GREATER_THAN' token

        const leftVal = this.stack.pop()
        const rightVal = this.evaluateExpression()

        if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
            throw new SemanticError(`Operator 'GT' can only be applied to numbers, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal > rightVal)
    }

    private interpretLessThan() {
        this.consume() // Consume 'LESS_THAN' token

        const leftVal = this.stack.pop()
        const rightVal = this.evaluateExpression()

        if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
            throw new SemanticError(`Operator 'LT' can only be applied to numbers, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal < rightVal)
    }

    private interpretAnd() {
        this.consume() // Consume 'AND' token

        const leftVal = this.stack.pop()
        const rightVal = this.evaluateExpression()

        if (typeof leftVal !== 'boolean' || typeof rightVal !== 'boolean') {
            throw new SemanticError(`Logical AND operator can only be applied to booleans, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal && rightVal)
    }

    private interpretOr() {
        this.consume() // Consume 'OR' token
        const leftVal = this.stack.pop()
        const rightVal = this.evaluateExpression()

        if (typeof leftVal !== 'boolean' || typeof rightVal !== 'boolean') {
            throw new SemanticError(`Logical OR operator can only be applied to booleans, but got '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal || rightVal)
    }

    private interpretNot() {
        this.consume() // Consume 'NOT' token
        
        if (this.current().type === "EQUALITY") {
            return this.interpretNotEq()
        }
        
        const rightVal = this.evaluateExpression()
        
        if (typeof rightVal !== 'boolean') {
            throw new SemanticError(`Logical NOT operator can only be applied to booleans, but got '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(!rightVal)
    }

    private interpretNotEq() {
        this.consume(); // consume 'EQUALITY'
        const leftVal = this.stack.pop()
        const rightVal = this.evaluateExpression()

        if (typeof leftVal !== typeof rightVal) {
            throw new SemanticError(`Cannot compare values of different types for inequality: '${typeof leftVal}' and '${typeof rightVal}'. Error at ${this.previous().line}:${this.previous().column}`);
        }

        this.stack.push(leftVal != rightVal)
    }

    private evaluateExpression() {
        if (this.current().type != "LEFT_PAREN") {
            return this.consume().literal
        } else {
            this.consume() // consume LEFT_PAREN
            while (this.current().type != "RIGHT_PAREN") {
                if(this.isAtEnd()) {
                    throw new RuntimeError("Unmatched parenthesis. Unexpected end of input.")
                }
                this.interpretToken()
            }

            this.consume() // consume RIGHT_PAREN
            return this.stack.pop()
        }
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

        if(this.stack.length === 0){
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
