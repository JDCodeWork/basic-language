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
        const sc = new Scanner(fileSource)

        sc.scan()
        sc
            .getTokens()
            .forEach(t =>
                console.log(t.toString())
            )
    } catch (error: any) {
        if (error.cause) {
            return console.error(`\n${error.message} >> ${error.cause}`)
        }

        console.error(`\n${error}`)
    }
}

main()
