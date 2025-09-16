<div align="center">
  <img width="100%" src="https://cdn.marmot-cloud.com/storage/zenmux/2025/09/16/lAK3vlZ/banner.png" alt="ZenMux Banner" />

  <p>
    <a href="#readme">English</a> | <a href="./readme/README_cn.md">简体中文</a>
  </p>
</div>

# ZenMux Documentation Repository

A VitePress-based multilingual documentation site. This is the source repository for the [ZenMux official documentation](https://docs.zenmux.ai/).

## Quick Start

1. Install dependencies

```sh
pnpm install
```

2. Local development (hot reload)

```sh
pnpm run dev
```

3. Production build (outputs to docs/ directory)

```sh
pnpm run build
```

4. Preview the built site locally

```sh
pnpm run preview
```

## Scripts

This project provides several handy scripts to streamline development:

### 📖 Docs Development

```sh
# Start dev server (hot reload)
pnpm run dev

# Build production version (outputs to docs/ directory)
pnpm run build

# Preview the built site
pnpm run preview
```

### 🌐 Translation Tool

```sh
# Translate Chinese docs to English (single file or entire folder supported)
pnpm run translate <path-to-chinese-file-or-folder> [--force] [--concurrency=5]

# Example: translate a single doc
pnpm run translate docs_source/zh/guide/quickstart.md

# Example: translate an entire folder (recursively process all Markdown files)
pnpm run translate docs_source/zh/

# Force re-translation (overwrite existing English files)
pnpm run translate docs_source/zh/guide/quickstart.md --force

# Customize concurrency (translate multiple files in parallel, default is 5)
pnpm run translate docs_source/zh/ --concurrency=10

# Full example: translate an entire folder, force overwrite, use 10-way concurrency
pnpm run translate docs_source/zh/ --force --concurrency=10
```

**Translation Tool Notes**:

- Supports single-file or folder input; folders are processed recursively for all Markdown files
- Automatically converts paths from `zh/` to `en/`
- Uses AI model (openai/gpt-5) for high-quality translation
- Preserves code blocks, variable names, and Markdown formatting
- Supports parallel processing of multiple files to improve translation throughput
- Requires the `ZENMUX_API_KEY` environment variable

**Parameters**:

- `--force`: force overwrite of existing target files
- `--concurrency=N`: set the number of concurrent translations (default 5; recommended not to exceed 10 to avoid API rate limiting)

### ✨ Docs Optimization

```sh
# Optimize the language and structure of Chinese docs
pnpm run optimize <input-file> <output-file> [--force]

# Example: optimize a draft document
pnpm run optimize draft.md docs_source/zh/guide/quickstart.md

# Force overwrite existing file
pnpm run optimize draft.md docs_source/zh/guide/quickstart.md --force
```

**Docs Optimization Tool Notes**:

- Improves expression and structure of Chinese docs
- Ensures correct use of VitePress syntax
- Harmonizes document style and formatting
- Requires the `ZENMUX_API_KEY` environment variable

### 🖼️ Image Formatting

```sh
# Automatically format images across all docs
pnpm run format-images
```

**Image formatting tool features**:

- Smartly categorizes different image types and sets appropriate sizes
- Consistent styling: responsive design, rounded corners, shadow effects
- Performance optimizations: lazy loading support, avoid redundant processing

**Notes**:

- In this repo, `docs_source/.vitepress/config.mts` has `outDir: '../docs'` set, so you don't need to pass `--out` on the CLI.
- Local full-text search is enabled (`search.provider = 'local'`).

## Directory Structure

```text
docs_source/                    # Docs source directory
├── .vitepress/config.mts      # VitePress configuration file
├── config.ts                  # Multi-language config center
├── index.md                   # English home page
├── en/                        # English docs directory
│   ├── config.ts              # English language config
│   └── [doc files]
├── zh/                        # Chinese docs directory (source language)
│   ├── config.ts              # Chinese language config
│   └── [doc files]
└── public/                    # Static assets directory

scripts/                       # Automation scripts
├── translate-zh-to-en/        # Translation scripts
├── optimize-chinese-docs/     # Docs optimization scripts
└── format-images.js           # Image formatting script

.prompts/                      # AI prompt templates
├── translation-zh-to-en.xml   # Translation prompts
└── optimize-chinese-docs.xml  # Optimization prompts

docs/                          # Build output directory (GitHub Pages publishing)
```

## How to Add New Docs

### Document Creation Workflow

1. Chinese first: create Chinese docs under `docs_source/zh/`
2. Auto-translate: use `pnpm run translate <path-to-chinese-file>` to generate the English version
3. Update navigation: add sidebar entries in the corresponding language's config.ts

### Routing Rules

- English docs: root paths, e.g., `/guide/getting-started`
- Chinese docs: prefixed with `/zh/`, e.g., `/zh/guide/getting-started`

## Deployment

The project is configured to auto-deploy to GitHub Pages:

1. Run `pnpm run build` to build into the `docs/` directory
2. Push to the main branch to automatically publish to `docs.zenmux.ai`

## Development Guidelines

- It is recommended to include a `title` field in the Markdown front matter
- After adding a new page, update the sidebar configuration for the corresponding language
