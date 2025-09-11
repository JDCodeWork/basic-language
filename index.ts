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

        console.log(rawTokens)
        new Parser(rawTokens).parse()
    } catch (error: any) {
        console.error(error.cause)
    }
}

main()
