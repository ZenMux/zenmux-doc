# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation repository for ZenMux, an LLM API aggregation service. It's built with VitePress and uses a bilingual approach (Chinese first, then English translation). The site is deployed via GitHub Pages from the `docs/` directory.

## Key Architecture

- **Source-first approach**: Documentation is written in Chinese first (`docs_source/zh/`), then translated to English (`docs_source/en/`)
- **VitePress with locales**: Uses VitePress 1.6.3 with bilingual configuration
- **Build output**: `docs_source/` → `docs/` (GitHub Pages deployment target)
- **Translation workflow**: Automated translation using OpenAI/Anthropic models via custom scripts

## Essential Commands

**IMPORTANT: This project uses pnpm, not npm. Always use `pnpm` commands.**

```bash
# Development server with hot reload (do NOT start this yourself — user runs pnpm dev locally)
pnpm run dev               # alias: pnpm run docs:dev

# Production build: vitepress build → copy-docs → copy-to-root
pnpm run build             # alias: pnpm run docs:build

# Preview built site locally
pnpm run preview           # alias: pnpm run docs:preview

# Format images in markdown files
pnpm run format-images
```

The `build` pipeline chains three steps:
1. `vitepress build docs_source` — outputs to `docs/`
2. `copy-docs` — copies `docs/vp-icons.css` → `docs/docs/vp-icons.css`
3. `copy-to-root` ([scripts/copy-to-root.sh](scripts/copy-to-root.sh)) — duplicates built pages into `docs/docs/` so both `/xx/` and `/docs/xx/` URLs resolve under GitHub Pages

## Directory Structure

```
docs_source/
├── .vitepress/config.mts          # VitePress configuration
├── config.ts                      # Locale configuration hub
├── index.ts                       # Entry
├── component/                     # Custom Vue components used in docs
├── en/                            # English documentation + locale config
├── zh/                            # Chinese documentation (source) + locale config
└── public/                        # Static assets

scripts/
├── copy-to-root.sh                # Post-build: duplicate docs/* into docs/docs/*
├── format-images.js               # Image formatting automation
├── postinstall.js                 # Runs after pnpm install
├── add-seo-meta.js                # SEO metadata injection
├── fake-router.js                 # Dev helper
└── test-*.py                      # Standalone API smoke tests (not wired into build)

docs/                              # Build output — committed, served by GitHub Pages
```

## Translation Workflow

Content is bilingual (Chinese source + English translation) but **there is no translation script in this repo**. New/updated English content must be written or translated manually and placed in `docs_source/en/` mirroring `docs_source/zh/`.

## VitePress Configuration Details

- **Locale setup**: Root locale (English) and `/zh/` prefix for Chinese via `rewrites` config
- **Custom containers**: `api-request` container (markdown-it-container) renders tabbed API examples
- **Code highlighting**: Enhanced with `[!code highlight]` syntax and language-specific icons
- **Search**: Local search enabled for both languages
- **Icons**: Custom code group icons via `vitepress-plugin-group-icons` with 50+ language mappings
- **Page compression**: Content is compressed with LZ-String for efficient transmission
- **Output directory**: Builds to `../docs` (relative to `docs_source/`) for GitHub Pages

## Development Guidelines

### Adding New Documentation

1. **Chinese first**: Always create content in `docs_source/zh/` directory
2. **File structure**: Mirror the same structure in both `zh/` and `en/` directories
3. **Sidebar updates**: Update both English and Chinese sidebar configurations in respective config files
4. **Translation**: Use the translation script to generate English versions

### VitePress Syntax Usage

- Use tip boxes: `::: tip 💡 Title` for important notes
- Use code groups: `::: code-group` for multi-language examples
- Use highlights: `# [!code highlight]` for emphasizing important code lines
- Use details: `::: details Title` for collapsible content

### File Naming and Routing

- English files: Direct paths like `/guide/quickstart`
- Chinese files: Prefixed paths like `/zh/guide/quickstart`
- Ensure consistent naming between language versions

## GitHub Pages Deployment

- Build output goes to `docs/` directory
- GitHub Pages serves from `docs/` folder on main branch
- Custom domain: `docs.zenmux.ai` (configured in `docs/CNAME`)
- Deployment is automatic on push to main branch

## Custom VitePress Features

### API Request Container

The codebase implements a custom `api-request` markdown container (see [config.mts:103-142](docs_source/.vitepress/config.mts#L103-L142)) that creates tabbed code examples. This renders as radio-button tabs with synchronized content switching, commonly used for multi-language API examples.

**Usage example:**

- Wrap code blocks in `::: api-request` container
- Use `[Tab Title]` syntax in code fence info string to create tabs
- First tab is selected by default

### Page Data Transformation

The config includes a `transformPageData` hook that:

- Sets `aside: false` for pages with `pageClass: 'api-page'` frontmatter
- Compresses page content with LZ-String base64 encoding for efficient data transfer
- Strips `<Copy />` components from content during processing
