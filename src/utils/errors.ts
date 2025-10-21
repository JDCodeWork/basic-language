export class SyntaxError extends Error {
    constructor(message: string) {
        super("Syntax", { cause: message })
    }
}

export class RuntimeError extends Error {
    constructor(message: string) {
        super("Runtime", { cause: message })
    }
}