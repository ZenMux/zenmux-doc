import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import type { Plugin } from 'vite'

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\n[\s\S]*?\n---\n?/, '').replace(/<Copy \/>/g, '')
}

function writeRawPages(docsRoot: string) {
  const publicDir = path.join(docsRoot, 'public')
  let count = 0

  for (const locale of ['en', 'zh'] as const) {
    const localeDir = path.join(docsRoot, locale)
    const files = glob.sync('**/*.md', { cwd: localeDir })

    for (const file of files) {
      const fullPath = path.join(localeDir, file)
      const raw = fs.readFileSync(fullPath, 'utf-8')
      const content = stripFrontmatter(raw)

      const outPath = path.join(publicDir, 'raw', locale, file.replace(/\.md$/, '.txt'))
      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(outPath, content)
      count++
    }
  }

  console.log(`[docs-index] Generated ${count} raw page files`)
}

export function docsIndexPlugin(options: { docsRoot: string }): Plugin {
  return {
    name: 'generate-docs-index',
    configureServer() {
      writeRawPages(options.docsRoot)
    },
    buildStart() {
      writeRawPages(options.docsRoot)
    },
  }
}
