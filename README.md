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

2. Start local development server (hot reload)

```sh
pnpm run dev
```

3. Build for production (outputs to `docs/` directory)

```sh
pnpm run build
```

4. Preview the built site locally

```sh
pnpm run preview
```

## Writing Documentation

This project follows a **Chinese-first** workflow: content is written in Chinese first, then translated to English.

### AI-Powered Tools (Claude Code Skills)

Translation and optimization are handled by [Claude Code](https://claude.ai/code) skills — no manual scripts or API keys required. Simply open this repo in Claude Code and describe what you want:

**Translate Chinese docs to English:**

> "Translate `docs_source/zh/guide/quickstart.md` to English"
>
> "Translate all files in `docs_source/zh/best-practices/` to English"
>
> "Force re-translate `docs_source/zh/guide/intro.md`"

The skill handles path conversion (`zh/` → `en/`), skips already-translated files by default, and automatically updates both sidebar configs.

**Optimize Chinese documentation:**

> "Optimize `docs_source/zh/guide/quickstart.md`"
>
> "Polish this draft and save it to `docs_source/zh/guide/new-feature.md`"

The skill improves language clarity, structure, and VitePress syntax — no extra setup needed.

### Image Formatting

```sh
# Auto-format all images across the documentation
pnpm run format-images
```

## Directory Structure

```text
docs_source/                    # Documentation source
├── .vitepress/config.mts      # VitePress configuration
├── config.ts                  # Locale configuration hub
├── index.md                   # English home page
├── en/                        # English documentation
│   ├── config.ts              # English locale config
│   └── [content files]
├── zh/                        # Chinese documentation (source language)
│   ├── config.ts              # Chinese locale config
│   └── [content files]
└── public/                    # Static assets

.claude/
├── skills/
│   ├── translate-docs/        # Translation skill (zh → en)
│   └── optimize-chinese-docs/ # Chinese doc optimization skill
└── agents/                    # (reserved)

.prompts/                      # AI prompt templates
├── translation-zh-to-en.xml   # Translation guidelines
└── optimize-chinese-docs.xml  # Optimization guidelines

scripts/                       # Utility scripts
└── format-images.js           # Image formatting

docs/                          # Build output (GitHub Pages)
```

## Contributing

We welcome all contributions — whether it's fixing a typo, improving an explanation, or adding a brand-new guide. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing. For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Adding a New Document

1. **Write Chinese first** — create your file under `docs_source/zh/`, mirroring the structure you want in `docs_source/en/`.

2. **Update the sidebar** — add an entry to `docs_source/zh/config.ts`:
   ```ts
   { text: "My New Page", link: "/zh/guide/my-new-page" }
   ```

3. **Translate to English** — open Claude Code and say:
   > "Translate `docs_source/zh/guide/my-new-page.md` to English"

   The skill will create the English file and add the sidebar entry to `docs_source/en/config.ts` automatically.

4. **Open a pull request** against the `main` branch.

> **Tips:**
> - It is recommended to include a `title` field in the Markdown front matter.
> - After adding a new page, update the sidebar configuration for the corresponding language.

### Editing an Existing Document

- **Fixing typos or small errors**: edit the Chinese file directly, then re-translate if the change is substantial.
- **Larger rewrites**: update the Chinese source, run the optimize skill if needed, then translate.
- Always keep Chinese and English versions in sync.

### File Naming Conventions

- Use lowercase kebab-case: `my-new-feature.md`
- Mirror the same filename in both `zh/` and `en/` directories
- Match the link path in the sidebar config exactly

### Routing Rules

| Language | Path pattern                  | Example                            |
| -------- | ----------------------------- | ---------------------------------- |
| English  | `/guide/page-name`            | `/guide/quickstart`                |
| Chinese  | `/zh/guide/page-name`         | `/zh/guide/quickstart`             |

### VitePress Syntax Tips

Use these elements to make docs clearer:

```markdown
::: tip Title
Helpful notes and best practices.
:::

::: warning
Important cautions.
:::

::: code-group

```python [Python]
# example
```

```ts [TypeScript]
// example
```

:::
```

## Deployment

The site auto-deploys to GitHub Pages on every push to `main`:

1. `pnpm run build` compiles sources into `docs/`
2. GitHub Pages serves from `docs/` at [docs.zenmux.ai](https://docs.zenmux.ai)

> `docs_source/.vitepress/config.mts` sets `outDir: '../docs'`, so no extra flags are needed.

## License

This documentation is open source and available under the MIT License.
