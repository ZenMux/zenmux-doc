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
# Development server with hot reload
pnpm run dev
# or
pnpm run docs:dev

# Production build (outputs to docs/ directory)
pnpm run build
# or
pnpm run docs:build

# Preview built site locally
pnpm run preview
# or
pnpm run docs:preview

# Translate Chinese docs to English (supports single file or entire folder)
pnpm run translate <path-to-zh-file-or-folder> [--force] [--concurrency=5]
# Example (single file): pnpm run translate docs_source/zh/guide/quickstart.md
# Example (folder): pnpm run translate docs_source/zh/
# Example (parallel): pnpm run translate docs_source/zh/ --concurrency=10

# Optimize Chinese docs using AI
pnpm run optimize <input-file> <output-file> [--force]
# Example: pnpm run optimize draft.md docs_source/zh/guide/quickstart.md

# Format images in markdown files
pnpm run format-images
```

## Directory Structure

```
docs_source/
├── .vitepress/config.mts          # VitePress configuration
├── config.ts                     # Locale configuration hub
├── en/                           # English documentation
│   ├── config.ts                 # English locale config
│   └── [content files]
├── zh/                           # Chinese documentation (source)
│   ├── config.ts                 # Chinese locale config
│   └── [content files]
└── public/                       # Static assets

scripts/translate-zh-to-en/       # Translation automation
├── translate-zh-to-en.ts         # Main translation script
└── README.md                     # Translation script documentation

scripts/optimize-chinese-docs/    # Documentation optimization
└── optimize-chinese-docs.ts      # Chinese docs optimization script

scripts/format-images.js          # Image formatting automation

.prompts/                         # Custom prompts for AI scripts
├── translation-zh-to-en.xml      # Translation prompt template
└── optimize-chinese-docs.xml     # Chinese docs optimization prompt
```

## Translation Workflow

1. Write Chinese documentation in `docs_source/zh/`
2. Use translation script: `pnpm run translate docs_source/zh/[file].md` (or entire folder)
3. Script automatically:
   - Converts `zh` paths to `en` paths
   - Uses AI model (openai/gpt-5) via ZenMux API for translation
   - Applies translation rules from `.prompts/translation-zh-to-en.xml`
   - Preserves code blocks, variable names, and markdown formatting
   - Supports parallel translation of multiple files with `--concurrency` flag (default: 5)
   - Skips existing files unless `--force` flag is used

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

## Script Environment Requirements

### Translation Script

- Environment variable: `ZENMUX_API_KEY` (required)
- Model: Uses `openai/gpt-5` via ZenMux API
- Prompt template: `.prompts/translation-zh-to-en.xml`
- Dependencies: `openai` SDK, `glob` for file matching

### Optimization Script

- Environment variable: `ZENMUX_API_KEY` (required)
- Prompt template: `.prompts/optimize-chinese-docs.xml`
- Purpose: Improve Chinese doc structure, style, and VitePress syntax before translation

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
