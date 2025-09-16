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

# Translate Chinese docs to English
pnpm run translate <path-to-zh-file> [--force]
# Example: pnpm run translate docs_source/zh/guide/quickstart.md

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
2. Use translation script: `pnpm run translate docs_source/zh/[file].md`
3. Script automatically:
   - Converts `zh` paths to `en` paths
   - Uses AI model (anthropic/claude-sonnet-4) for translation
   - Applies translation rules from `.prompts/translation-zh-to-en.xml`
   - Preserves code blocks, variable names, and markdown formatting

## VitePress Configuration Details

- **Locale setup**: Root locale (English) and `/zh/` prefix for Chinese
- **Custom containers**: `api-request` container for API examples with tabs
- **Code highlighting**: Enhanced with `[!code highlight]` syntax
- **Search**: Local search enabled for both languages
- **Icons**: Custom code group icons via `vitepress-plugin-group-icons`

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

## Translation Script Environment

The translation script requires:

- Environment variable: `ZENMUX_API_KEY` (ZenMux API key)
- Model: Uses `anthropic/claude-sonnet-4` via ZenMux API
- Prompt: Located at `.prompts/translation-zh-to-en.xml`

## GitHub Pages Deployment

- Build output goes to `docs/` directory
- GitHub Pages serves from `docs/` folder on main branch
- Custom domain: `docs.zenmux.ai` (configured in `docs/CNAME`)
- Deployment is automatic on push to main branch

## Content Optimization

Use the optimization script to improve Chinese documentation drafts before translation:

```bash
pnpm run optimize <input-file> <output-file> [--force]
```

The script:
- Uses the prompt at `.prompts/optimize-chinese-docs.xml`
- Applies AI-powered optimization for style, structure, and VitePress syntax
- Ensures consistency with existing documentation standards
- Requires `ZENMUX_API_KEY` environment variable
