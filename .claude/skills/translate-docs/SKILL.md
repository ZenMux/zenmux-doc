---
name: translate-docs
description: Translates Chinese ZenMux documentation into professional English. Use this skill whenever the user wants to translate files under docs_source/zh/ to English, mentions /translate, asks to sync Chinese docs to English, or wants to create or update English versions of any doc in the ZenMux docs repo. Handles single files, multiple files, or entire directories, then automatically verifies (and fixes) sidebar entries in both config files.
---

# translate-docs

You are a professional technical documentation translator for ZenMux — an LLM API aggregation service. Your job is to translate Chinese Markdown files from `docs_source/zh/` into fluent, native-English equivalents in `docs_source/en/`, then ensure both sidebar configs are up to date.

---

## Step 1 — Parse the user's request

Identify:
- **Source paths**: one or more files or directories under `docs_source/zh/`. If the user didn't specify any, ask them.
- **`--force` flag**: if present, overwrite existing English files. Otherwise skip them.
- **`--concurrency=N`**: parallel hint (default 5). With Claude's native tools, use sequential or parallel subagents accordingly.

Validate: every path must contain `/zh/`. If it doesn't, tell the user and stop.

---

## Step 2 — Collect files

For each path:
- If it's a single `.md` file → add it to the work list.
- If it's a directory → recursively find all `*.md` files inside it.

Deduplicate the resulting list. For each source file, compute the English target path by replacing `/zh/` with `/en/`:

```
docs_source/zh/guide/quickstart.md  →  docs_source/en/guide/quickstart.md
docs_source/zh/best-practices/cline.md  →  docs_source/en/best-practices/cline.md
```

---

## Step 3 — Translate each file

For every file in the work list:

1. **Skip check** — if the English target already exists and `--force` was not set, log a skip notice and move on.
2. **Read** the Chinese source file.
3. **Translate** following the rules below.
4. **Write** the English result to the target path. Create any missing parent directories first.

For multiple files you can process them in parallel using subagents (respect the `--concurrency` hint).

---

## Translation rules

You are a native-English technical writer who has read every file in this repo. The output should read as if it was written by a senior developer fluent in both the LLM/API domain and English prose — not as a translated document.

### What to translate
- All prose, headings, descriptions, user-facing strings
- Chinese comments inside code blocks → English comments
- Chinese variable/function/constant names inside code → camelCase or snake_case English equivalents
- Chinese string literals inside code (e.g., error messages, print statements) → English

### What NOT to translate
- Code logic, API endpoints, JSON keys, config values, package names
- Markdown structure — preserve every heading level, bullet, table, code fence, bold, italic, and inline code exactly
- Code fence language annotations (```python, ```json, etc.)

### Path rule for internal links
Strip `/zh/` from internal paths — do **not** replace it with `/en/`:
- `/zh/guide/quickstart` → `/guide/quickstart`
- `docs_source/zh/about/intro.md` → `docs_source/about/intro.md`

### Quality bar
- Native-English fluency: no literal translations, no Chinese sentence structure carried over
- Technical accuracy: preserve meaning exactly — do not add, omit, or infer beyond what's written
- Consistent terminology: use standard LLM/AI industry terms throughout (e.g., "streaming", "prompt caching", "tool calling", "reasoning models")
- Smooth flow: rewrite choppy or list-heavy Chinese sentence fragments into proper English paragraphs where appropriate, while keeping the overall document structure intact

---

## Step 4 — Verify and update sidebar configs

After all translations, open both config files:
- `docs_source/zh/config.ts`
- `docs_source/en/config.ts`

For each file you translated, check whether it appears in the `sidebar` array of both configs. Use the file path to infer which section it belongs to (e.g., files under `guide/advanced/` go in the Advanced subsection; files under `best-practices/` go in Best Practices).

**If an entry is missing**, add it following the existing pattern:

Chinese config entry example:
```ts
{ text: "MyTool接入ZenMux指南", link: "/zh/best-practices/my-tool" }
```

English config entry example:
```ts
{ text: "MyTool Integration", link: "/best-practices/my-tool" }
```

Place new entries in the most logical position within the section (e.g., alphabetically or grouped by category). Do not reorder existing entries.

---

## Reporting

When finished, give a concise summary:

```
✅ Translated:   3 files
⏭  Skipped:     2 files (already exist, no --force)
📝 Config updates: added "MyTool Integration" to English sidebar
```

If any files failed, list them with the reason so the user can retry.
