import { Interpreter } from "./src/interpreter"
import { Parser } from "./src/parser"
import { Scanner } from "./src/scanner"

async function readFile(filePath: string) {
    if (!filePath) throw new Error('CLI', { cause: 'No file path provided' })

    try {
        const fileSource = await Bun.file(filePath).text()

        return fileSource
    } catch (error: any) {
        throw new Error('CLI', { cause: error.message })
    }
}

async function main() {
    try {
        const filePath = process.argv[2]

        const fileSource = await readFile(filePath)
        const rawTokens = new Scanner(fileSource).scan()

        const tokens = new Parser(rawTokens).parse()

        new Interpreter(tokens).interpret()

    } catch (error: any) {
        if (error.cause) {
            return console.error(`\n${error.message} >> ${error.cause}`)
        }

        console.error(`\n${error}`)
    }
}

main()
