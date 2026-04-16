import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import type { Plugin } from 'vite'

export interface DocPage {
  title: string
  path: string
  headings: string[]
  content: string
}

export interface DocChunk {
  id: string
  pageTitle: string
  pagePath: string
  heading: string
  content: string
}

export interface ChunksIndex {
  createdAt: string
  chunks: DocChunk[]
}

/**
 * Clean markdown for indexing.
 * Only removes frontmatter, HTML comments/tags, and formatting markers.
 * Preserves code blocks, tables, and all textual content.
 */
function cleanMarkdown(raw: string): string {
  let text = raw
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n?/, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove HTML tags and Vue components like <Copy />
    .replace(/<[^>]+\/?>/g, '')
    // Preserve images with absolute URLs, remove relative-path images
    .replace(/!\[.*?\]\((?!https?:\/\/).*?\)/g, '')
    // Convert links [text](url) to just text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove VitePress container markers but keep inner text
    .replace(/^:::\s*\w+.*$/gm, '')
    .replace(/^:::$/gm, '')
    // Remove markdown emphasis markers
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove heading markers (keep text)
    .replace(/^#{1,6}\s+/gm, '')
    // Collapse multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return text
}

/**
 * Extract the first h1 heading as title.
 */
function extractTitle(raw: string): string {
  // Generic titles that are not useful for identification
  const GENERIC_TITLES = new Set(['接口', '文档', '页面'])

  // Try frontmatter title first
  const fmMatch = raw.match(/^---\n[\s\S]*?title:\s*(.+?)\n[\s\S]*?---/)
  const fmTitle = fmMatch ? fmMatch[1].trim().replace(/^['"]|['"]$/g, '') : ''

  // Try first # heading
  const h1Match = raw.match(/^#\s+(.+)$/m)
  const h1Title = h1Match ? h1Match[1].trim() : ''

  // Prefer H1 over generic frontmatter titles
  if (fmTitle && !GENERIC_TITLES.has(fmTitle)) return fmTitle
  if (h1Title) return h1Title
  if (fmTitle) return fmTitle

  return ''
}

/**
 * Extract h2 and h3 headings.
 */
function extractHeadings(raw: string): string[] {
  const headings: string[] = []
  const regex = /^#{2,3}\s+(.+)$/gm
  let match
  while ((match = regex.exec(raw)) !== null) {
    headings.push(match[1].trim())
  }
  return headings
}

/**
 * Convert a file path relative to docs_source to a URL path.
 * en/guide/quickstart.md → /guide/quickstart
 * zh/guide/quickstart.md → /zh/guide/quickstart
 */
function filePathToUrl(relPath: string, locale: string): string {
  // Remove locale prefix and .md extension
  let url = relPath
    .replace(/^(en|zh)\//, locale === 'en' ? '/' : '/zh/')
    .replace(/\.md$/, '')
    .replace(/\/index$/, '/')

  // Ensure leading slash
  if (!url.startsWith('/')) url = '/' + url

  return url
}

function generateIndex(docsRoot: string, locale: 'en' | 'zh'): DocPage[] {
  const localeDir = path.join(docsRoot, locale)
  const files = glob.sync('**/*.md', { cwd: localeDir })
  const pages: DocPage[] = []

  for (const file of files) {
    // Skip deprecated/old API docs
    if (file.includes('-old.md')) continue

    const fullPath = path.join(localeDir, file)
    const raw = fs.readFileSync(fullPath, 'utf-8')

    const title = extractTitle(raw)
    if (!title) continue // Skip pages without a clear title

    const headings = extractHeadings(raw)
    const content = cleanMarkdown(raw)
    const urlPath = filePathToUrl(`${locale}/${file}`, locale)

    pages.push({ title, path: urlPath, headings, content })
  }

  // Deduplicate by title (keep the one with more specific path, e.g. /best-practices/x over /x)
  const seen = new Map<string, number>()
  for (let i = 0; i < pages.length; i++) {
    const key = pages[i].title
    if (seen.has(key)) {
      const prevIdx = seen.get(key)!
      // Keep the longer (more specific) path
      if (pages[i].path.length > pages[prevIdx].path.length) {
        pages[prevIdx] = pages[i]
      }
      pages.splice(i, 1)
      i--
    } else {
      seen.set(key, i)
    }
  }

  return pages
}

/**
 * Estimate token count for a text string.
 * English: ~4 chars per token. Chinese: ~2 chars per token.
 */
function estimateTokens(text: string): number {
  const zhChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const otherChars = text.length - zhChars
  return Math.ceil(zhChars / 2 + otherChars / 4)
}

/**
 * Split a page's cleaned markdown into heading-aware chunks.
 *
 * Strategy:
 * 1. Split by ## and ### headings
 * 2. Each chunk gets a heading breadcrumb prefix for context
 * 3. Oversized sections (>500 tokens) are split by paragraphs
 * 4. Undersized sections (<100 tokens) are merged with the next section
 */
function chunkPage(raw: string, pageTitle: string, pagePath: string, locale: string): DocChunk[] {
  // Remove frontmatter first
  const noFrontmatter = raw.replace(/^---[\s\S]*?---\n?/, '')

  // Split by h2/h3 headings, keeping the heading with its content
  const sections: { heading: string; content: string; level: number }[] = []
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  let lastIndex = 0
  let lastHeading = pageTitle
  let lastLevel = 1
  let match

  while ((match = headingRegex.exec(noFrontmatter)) !== null) {
    // Capture content before this heading
    const contentBefore = noFrontmatter.slice(lastIndex, match.index).trim()
    if (contentBefore) {
      sections.push({ heading: lastHeading, content: contentBefore, level: lastLevel })
    }
    lastHeading = match[2].trim()
    lastLevel = match[1].length
    lastIndex = match.index + match[0].length
  }
  // Capture remaining content after last heading
  const remaining = noFrontmatter.slice(lastIndex).trim()
  if (remaining) {
    sections.push({ heading: lastHeading, content: remaining, level: lastLevel })
  }

  // If no sections found, treat entire page as one chunk
  if (sections.length === 0) {
    const cleaned = cleanMarkdown(raw)
    if (!cleaned) return []
    return [{
      id: `${locale}:${pagePath}#0`,
      pageTitle,
      pagePath,
      heading: pageTitle,
      content: cleaned,
    }]
  }

  // Build heading breadcrumbs and clean content
  const chunks: DocChunk[] = []
  let currentH2 = pageTitle
  let chunkIdx = 0

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    // Track h2 for breadcrumb
    if (section.level === 2) {
      currentH2 = section.heading
    }

    // Build breadcrumb
    const breadcrumb = section.level === 3
      ? `${pageTitle} > ${currentH2} > ${section.heading}`
      : section.level === 2
        ? `${pageTitle} > ${section.heading}`
        : pageTitle

    // Clean the section content
    const cleaned = cleanMarkdown(section.content)
    if (!cleaned) continue

    const tokens = estimateTokens(cleaned)

    // Merge undersized sections with next
    if (tokens < 100 && i < sections.length - 1) {
      sections[i + 1].content = section.content + '\n\n' + sections[i + 1].content
      continue
    }

    // Split oversized sections by paragraphs
    if (tokens > 500) {
      const paragraphs = cleaned.split(/\n\n+/)
      let currentChunk = ''
      for (const para of paragraphs) {
        const combined = currentChunk ? currentChunk + '\n\n' + para : para
        if (estimateTokens(combined) > 500 && currentChunk) {
          chunks.push({
            id: `${locale}:${pagePath}#${chunkIdx++}`,
            pageTitle,
            pagePath,
            heading: breadcrumb,
            content: currentChunk,
          })
          currentChunk = para
        } else {
          currentChunk = combined
        }
      }
      if (currentChunk) {
        chunks.push({
          id: `${locale}:${pagePath}#${chunkIdx++}`,
          pageTitle,
          pagePath,
          heading: breadcrumb,
          content: currentChunk,
        })
      }
    } else {
      chunks.push({
        id: `${locale}:${pagePath}#${chunkIdx++}`,
        pageTitle,
        pagePath,
        heading: breadcrumb,
        content: cleaned,
      })
    }
  }

  return chunks
}

/**
 * Generate chunk index for a locale.
 */
function generateChunksIndex(docsRoot: string, locale: 'en' | 'zh'): ChunksIndex {
  const localeDir = path.join(docsRoot, locale)
  const files = glob.sync('**/*.md', { cwd: localeDir })
  const allChunks: DocChunk[] = []

  for (const file of files) {
    if (file.includes('-old.md')) continue

    const fullPath = path.join(localeDir, file)
    const raw = fs.readFileSync(fullPath, 'utf-8')

    const title = extractTitle(raw)
    if (!title) continue

    const urlPath = filePathToUrl(`${locale}/${file}`, locale)
    const chunks = chunkPage(raw, title, urlPath, locale)
    allChunks.push(...chunks)
  }

  return {
    createdAt: new Date().toISOString(),
    chunks: allChunks,
  }
}

function writeIndexFiles(docsRoot: string) {
  const publicDir = path.join(docsRoot, 'public')

  for (const locale of ['en', 'zh'] as const) {
    // Existing page-level index (kept for VitePress local search)
    const pages = generateIndex(docsRoot, locale)
    const pageOutPath = path.join(publicDir, `docs-index-${locale}.json`)
    fs.writeFileSync(pageOutPath, JSON.stringify(pages))
    console.log(`[docs-index] Generated ${pageOutPath} (${pages.length} pages)`)

    // New chunk-level index for RAG
    const chunksIndex = generateChunksIndex(docsRoot, locale)
    const chunkOutPath = path.join(publicDir, `chunks-index-${locale}.json`)
    fs.writeFileSync(chunkOutPath, JSON.stringify(chunksIndex))
    console.log(`[docs-index] Generated ${chunkOutPath} (${chunksIndex.chunks.length} chunks)`)
  }
}

export function docsIndexPlugin(options: { docsRoot: string }): Plugin {
  return {
    name: 'generate-docs-index',
    configureServer() {
      // Generate index when dev server starts
      writeIndexFiles(options.docsRoot)
    },
    buildStart() {
      // Generate index at build start
      writeIndexFiles(options.docsRoot)
    },
  }
}
