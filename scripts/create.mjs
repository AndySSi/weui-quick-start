import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const source = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const destination = process.argv[2] && resolve(process.cwd(), process.argv[2])
if (!destination) throw new Error('用法：pnpm create <新项目目录>')
// 非递归创建：目标已存在（即使为空）也拒绝覆盖。
await mkdir(destination)
for (const entry of [
  'src',
  'scripts',
  'docs',
  '.vscode',
  'index.html',
  'package.json',
  'pnpm-lock.yaml',
  'vite.config.ts',
  'uno.config.ts',
  'tsconfig.json',
  '.gitignore',
  '.prettierrc.json',
  '.prettierignore',
  '.editorconfig',
  'README.md',
]) {
  await cp(resolve(source, entry), resolve(destination, entry), {
    recursive: true,
    force: false,
    errorOnExist: true,
  })
}
const packagePath = resolve(destination, 'package.json')
const pkg = JSON.parse(await readFile(packagePath, 'utf8'))
pkg.name =
  basename(destination)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') || 'weui-app'
await writeFile(packagePath, JSON.stringify(pkg, null, 2) + '\n')
console.log(`已创建 ${destination}\n进入该目录执行 pnpm install，然后 pnpm dev。`)
