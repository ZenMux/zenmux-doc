# Contributing to ZenMux Documentation

Thanks for your interest in contributing to ZenMux documentation! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm (required - this project uses pnpm, not npm or yarn)

### Getting Started

1. Fork and clone the repository:
```bash
git clone https://github.com/your-username/zenmux-doc.git
cd zenmux-doc
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

The site will be available at `http://localhost:5173`.

## Project Structure

```
zenmux-doc/
├── docs_source/              # Documentation source
│   ├── .vitepress/           # VitePress configuration
│   ├── zh/                   # Chinese docs (source language)
│   ├── en/                   # English docs (translated)
│   ├── config.ts             # Multi-language config
│   └── public/               # Static assets
├── scripts/                  # Automation scripts
│   ├── translate-zh-to-en/   # Translation tools
│   ├── optimize-chinese-docs/# Docs optimization
│   └── format-images.js      # Image formatting
├── .prompts/                 # AI prompt templates
└── docs/                     # Build output (GitHub Pages)
```

## Documentation Workflow

### Chinese-First Approach

ZenMux documentation follows a **Chinese-first** workflow:

1. Write documentation in Chinese (`docs_source/zh/`)
2. Use automated translation to generate English versions
3. Review and refine translations as needed

### Adding New Documentation

1. **Create Chinese documentation**:
```bash
# Create your doc in docs_source/zh/
docs_source/zh/guide/my-new-feature.md
```

2. **Update sidebar configuration**:
```typescript
// docs_source/zh/config.ts
sidebar: [
  {
    text: 'Guide',
    items: [
      { text: 'My New Feature', link: '/zh/guide/my-new-feature' }
    ]
  }
]
```

3. **Translate to English**:
```bash
# Single file
pnpm run translate docs_source/zh/guide/my-new-feature.md

# Entire folder
pnpm run translate docs_source/zh/guide/

# Force overwrite existing files
pnpm run translate docs_source/zh/guide/my-new-feature.md --force

# Parallel translation (faster for multiple files)
pnpm run translate docs_source/zh/ --concurrency=10
```

4. **Update English sidebar**:
```typescript
// docs_source/en/config.ts
sidebar: [
  {
    text: 'Guide',
    items: [
      { text: 'My New Feature', link: '/guide/my-new-feature' }
    ]
  }
]
```

## Translation Guidelines

### Using the Translation Script

The translation script uses AI (OpenAI GPT-5 via ZenMux API) to translate Chinese docs to English:

```bash
# Set up API key (required)
export ZENMUX_API_KEY=your_api_key

# Translate single file
pnpm run translate docs_source/zh/guide/quickstart.md

# Translate entire directory
pnpm run translate docs_source/zh/

# Options
--force           # Overwrite existing English files
--concurrency=N   # Number of parallel translations (default: 5)
```

### Translation Features

- Preserves code blocks and variable names
- Maintains Markdown formatting
- Converts paths automatically (`zh/` → `en/`)
- Skips existing files unless `--force` is used
- Supports parallel processing for faster translation

## Documentation Optimization

Before translation, you can optimize Chinese docs for better structure and clarity:

```bash
pnpm run optimize draft.md docs_source/zh/guide/quickstart.md

# Force overwrite
pnpm run optimize draft.md docs_source/zh/guide/quickstart.md --force
```

## VitePress Syntax

### Tip Boxes

```markdown
::: tip 💡 Important
This is an important note
:::

::: warning ⚠️ Warning
This is a warning
:::

::: danger ❌ Danger
This is a danger notice
:::
```

### Code Groups

```markdown
::: code-group
```js [JavaScript]
console.log('Hello')
\```

```python [Python]
print('Hello')
\```
:::
```

### Code Highlighting

```markdown
```js
const important = true; // [!code highlight]
const removed = false;  // [!code --]
const added = true;     // [!code ++]
\```
```

### Collapsible Content

```markdown
::: details Click to expand
Hidden content here
:::
```

## Image Guidelines

### Image Formatting

Run the image formatter to ensure consistent styling:

```bash
pnpm run format-images
```

This automatically:
- Sets appropriate sizes for different image types
- Adds responsive design, rounded corners, and shadows
- Enables lazy loading

### Image Placement

- Store images in `docs_source/public/`
- Reference with absolute paths: `/images/example.png`
- Use descriptive alt text for accessibility

## Testing Your Changes

1. **Development mode**:
```bash
pnpm run dev
```

2. **Production build**:
```bash
pnpm run build
```

3. **Preview build**:
```bash
pnpm run preview
```

## Submitting Changes

1. Create a new branch:
```bash
git checkout -b docs/improve-quickstart-guide
```

2. Make your changes and commit:
```bash
git add .
git commit -m "docs: improve quickstart guide"
```

3. Push to your fork:
```bash
git push origin docs/improve-quickstart-guide
```

4. Open a pull request with:
   - Clear description of changes
   - Screenshots if UI changes
   - Both Chinese and English versions (if applicable)

## Commit Convention

Use conventional commits:

- `docs:` - Documentation changes
- `feat:` - New features or pages
- `fix:` - Bug fixes
- `style:` - Formatting changes
- `refactor:` - Code refactoring
- `chore:` - Build process or tooling changes

## Environment Variables

For translation and optimization scripts:

```bash
# Required for translation and optimization
ZENMUX_API_KEY=your_api_key
```

## Need Help?

- Check existing documentation for examples
- Review the [CLAUDE.md](CLAUDE.md) file for technical details
- Open an issue for questions
- Join discussions in pull requests

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
