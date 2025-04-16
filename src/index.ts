#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import readline from 'readline'
import chalk from 'chalk'

const __dirname = dirname(fileURLToPath(import.meta.url));

const ask = (question: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(`${question} `, answer => {
        rl.close()
        resolve(answer)
    }));
}

async function writeFileSafe(filePath: string, content: string) {
    const dir = dirname(filePath)
    await mkdir(dir, { recursive: true })
    await writeFile(filePath, content, 'utf8')
}

async function main() {

    try {

        let name = process.argv[2]

        if (!name)
            name = await ask("Where would you like to create your project? (Press Enter to use the current directory):")

        for (const file of [
            { src: 'template/index.ts', dest: '/src/index.ts' },
            { src: 'template/.env', dest: '.env' },
            { src: 'template/config.json', dest: 'config.json' },
            { src: 'template/package.json', dest: 'package.json' },
            { src: 'template/tsconfig.json', dest: 'tsconfig.json' },
        ]) {
            const destPath = join(process.cwd(), name, file.dest);

            if ((file.dest === '.env' || file.dest === 'config.json') && existsSync(destPath))
                continue

            const content = await readFile(join(__dirname, file.src), 'utf-8')
            await writeFileSafe(destPath, content)
        }

        execSync(`npm install noonjs@latest --loglevel=error`, {
            cwd: join(process.cwd(), name),
            stdio: 'inherit'
        })

        console.log("\n")
        console.log('✅   Noon project has been created.')
        console.log("\n")

        console.log('Next steps:')
        console.log(
            `${chalk.red(
                '⚠️   IMPORTANT: '
            )}Replace your MongoDB connection string in the ${chalk.red(
                '.env'
            )} file or ${chalk.red(
                'config.json'
            )}. In production, use environment variables to securely pass it.`
        )

        if (name)
            console.log(chalk.green(`cd ${name}`))
        console.log(`Start development server with ${chalk.green("npm run dev")}`)

        console.log("\n")

    } catch (err: any) {
        console.error('Error creating file:', err.message)
        process.exit(1)
    }
}

main();