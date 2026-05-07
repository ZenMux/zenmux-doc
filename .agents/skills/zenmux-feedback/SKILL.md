---
name: zenmux-feedback
description: >-
  Submit GitHub issues, feature requests, bug reports, product suggestions, and feedback
  to the ZenMux repository (ZenMux/zenmux-doc). Use this skill whenever the user wants to:
  report a bug, request a feature, suggest a product improvement, give feedback, request
  support for a new model or provider, report a documentation issue, or share their experience.
  Trigger on phrases like: "submit issue", "file a bug", "feature request", "report a problem",
  "I have an idea", "提交issue", "提反馈", "功能建议", "报告bug", "产品建议", "提个需求",
  "新增模型", "新增供应商", "文档问题", "我想提个建议", "提交建议". If the user is describing
  a ZenMux problem or product idea and would benefit from submitting it formally, proactively
  offer to help them create an issue.
---

# zenmux-feedback

Help users submit issues and feedback to the ZenMux GitHub repository with minimal friction.

ZenMux is built in public — every piece of user feedback directly shapes the product. Your job is to make submission feel effortless: gather just enough info through natural conversation, compose a well-structured issue, and submit it. The target repository is **ZenMux/zenmux-doc**.

## Step 0: Sync references & check prerequisites (MUST run first)

### 0a. Verify GitHub CLI

```bash
gh --version 2>&1 && gh auth status 2>&1
```

**If `gh` is not installed** — stop the workflow and tell the user:

1. This skill requires **GitHub CLI (`gh`)** to submit issues
2. Install it:
   - **macOS**: `brew install gh`
   - **Linux**: `sudo apt install gh` or `sudo dnf install gh`
   - **Windows**: `winget install --id GitHub.cli`
   - **Other**: https://cli.github.com/
3. Then run `gh auth login` to authenticate
4. Mention that ZenMux uses structured issue templates — the user can browse them at `skills/zenmux-feedback/references/zenmux-doc/.github/ISSUE_TEMPLATE/` to preview the fields each issue type requires
5. Do NOT proceed — wait for the user to install and authenticate first

**If `gh` is installed but not authenticated** — tell the user to run `gh auth login`, then re-run this skill.

### 0b. Update issue templates from upstream

Run the update script to clone or pull the latest zenmux-doc repository:

```bash
bash skills/zenmux-feedback/scripts/update-references.sh
```

Then read **all** `.yml` files under `skills/zenmux-feedback/references/zenmux-doc/.github/ISSUE_TEMPLATE/` to get the latest fields, dropdown options, and validation rules. These templates are the **source of truth** — if template fields have changed from what's described below, follow the templates.

### 0c. Fetch available repo labels

```bash
gh label list --repo ZenMux/zenmux-doc --limit 100
```

Cache this list. In Step 5, **only apply labels that appear in this list**. If a label from the type mapping below doesn't exist in the repo, silently drop it — never pass non-existent labels to `gh issue create`.

### If all checks pass

Proceed to Step 1.

## Step 1: Identify submission type

From the user's message, determine which type fits:

| Type | Signals | Title prefix | Labels (apply only if they exist in repo) |
|------|---------|-------------|------------------------------------------|
| **Bug Report** | Something broken, errors, unexpected behavior | `[Bug]: ` | `bug` |
| **Feature Request** | Wants new functionality or improvements | `[Feature]: ` | `enhancement` |
| **Provider/Model Request** | Wants a new LLM provider or model | `[Provider]: ` | `enhancement` |
| **Doc Feedback** | Doc errors, missing content, broken links | `[Docs]: ` | `documentation` |
| **General Feedback** | Impressions, experience, suggestions, comparisons | `[Feedback]: ` | `enhancement` |

> **Note:** The upstream issue templates define additional labels (`needs-triage`, `provider-request`, `feedback`, `community`) that may not yet exist in the repo. The label list fetched in Step 0c is authoritative — only use labels confirmed to exist.

Usually you can infer the type. Examples:
- "API returns 500 when streaming" → Bug Report
- "Hope ZenMux can support Mistral" → Provider/Model Request
- "Wish the dashboard showed per-model cost" → Feature Request
- "The quickstart guide link is broken" → Doc Feedback
- "Been using ZenMux a month, here's what I think" → General Feedback

If ambiguous, ask briefly — but don't over-classify. Use AskUserQuestion with the options above for quick selection.

## Step 2: Gather information conversationally

Extract as much as you can from what the user already said. Then ask only for what's truly missing — group related questions together and keep it to 1-2 rounds of questions at most.

### What to gather per type

**Bug Report** (essential → optional):
- Description of the bug ← often already in the user's message
- Steps to reproduce
- Expected vs actual behavior
- Category (API / Streaming / Routing / Protocol / Multimodal / Tool calling / etc.)
- API protocol (OpenAI / Anthropic / Gemini / Platform / N/A)
- Severity (Critical / High / Medium / Low)
- _Optional: environment info, generation_id, integration tool (Claude Code / Cursor / Cline / etc.), screenshots_

**Feature Request** (essential → optional):
- Problem or pain point ← often already stated
- Proposed solution or desired behavior
- Category (API / Routing / Streaming / Observability / Billing / etc.)
- Priority (Critical / High / Medium / Low)
- _Optional: use case, alternatives considered, willingness to help implement_

**Provider/Model Request** (essential → optional):
- Provider name
- Model(s) requested
- Request type (new provider / new model from existing provider / model update)
- Model type (text / code / image / video / embedding / multimodal / reasoning / etc.)
- Use case
- Priority
- _Optional: API protocol compatibility, API docs link_

**Doc Feedback** (essential → optional):
- Which section is affected
- What kind of issue (incorrect info / missing content / translation error / broken link / unclear / etc.)
- Description of the problem
- Language version (English / Chinese / Both)
- _Optional: page URL, suggested fix, willingness to submit PR_

**General Feedback** (essential → optional):
- Feedback type (product impressions / UX / model quality / pricing / comparison / etc.)
- The feedback content itself
- _Optional: satisfaction level, primary use case, role, plan, one thing they'd change, how they found ZenMux_

### Conversation guidelines

- If the user's initial message already covers most required fields, don't re-ask. Confirm your understanding and only fill gaps.
- Use AskUserQuestion for fields with fixed options (category, severity, priority) — it's faster than typing.
- For optional fields, only ask when context suggests they'd add real value. Don't ask about `generation_id` unless they're reporting an API error.
- Encourage the user — their input shapes ZenMux. No feedback is too small.

## Step 3: Compose the issue

Build a well-formatted issue body in markdown. Structure it to match what GitHub issue templates produce for consistency. Only include fields that have meaningful content — skip empty optional sections.

### Body format by type

**Bug Report:**
```markdown
### Category
[e.g., API (request handling, response, errors)]

### API protocol used
[e.g., OpenAI Chat Completions (/api/v1)]

### Describe the bug
[Clear description]

### Steps to reproduce
1. ...
2. ...

### Expected behavior
[What should happen]

### Actual behavior
[What actually happened, including error messages/codes if any]

### Severity
[e.g., High - Major feature is broken, no workaround]

### Environment
- SDK: [e.g., Python (openai) v1.x.x]
- Model slug: [e.g., openai/gpt-5]
- Integration tool: [e.g., Claude Code]

### Additional context
[If any]
```

**Feature Request:**
```markdown
### Category
[e.g., Observability (logs, cost tracking, usage analytics)]

### Problem / Pain point
[What problem this solves]

### Proposed solution
[How the user wants it to work]

### Use case
[Real-world scenario]

### How important is this to you?
[e.g., High - Would significantly improve my experience]

### Alternatives considered
[If any]
```

**Provider/Model Request:**
```markdown
### Provider name
[e.g., Mistral]

### Model(s) requested
- model-name-1
- model-name-2

### Request type
[New provider / New model from existing provider / Update]

### Model type
[e.g., Text generation, Code generation]

### Use case
[Why they need this]

### How urgently do you need this?
[e.g., Medium - Would be nice to have]
```

**Doc Feedback:**
```markdown
### Documentation section
[e.g., Getting started / Quickstart]

### What kind of issue?
[e.g., Incorrect or outdated information]

### Language version affected
[English / Chinese / Both]

### Description
[The issue or suggestion]

### Page URL
[If provided]
```

**General Feedback:**
```markdown
### Feedback type
[e.g., Product impressions / First experience]

### Your feedback
[The feedback content]

### How satisfied are you with ZenMux overall?
[If provided]

### What do you primarily use ZenMux for?
[If provided]

### If you could change one thing about ZenMux, what would it be?
[If provided]
```

## Step 4: Preview and confirm

Show the user the complete issue before submitting:

1. Display the **title** (with prefix like `[Feature]: ...`)
2. Display the **body** formatted clearly
3. Mention which **labels** will be applied
4. Ask the user to confirm, or adjust anything

Never submit without explicit confirmation.

## Step 5: Submit

Since `gh` was verified in Step 0, write the body to a temp file and submit. **Before submitting, cross-check labels against the list fetched in Step 0c — only include labels that actually exist in the repo.** If none of the desired labels exist, omit the `--label` flag entirely.

```bash
# Write body to temp file to avoid shell escaping issues
cat > /tmp/zenmux-issue-body.md << 'ISSUE_BODY'
[composed body here]
ISSUE_BODY

gh issue create \
  --repo ZenMux/zenmux-doc \
  --title "[Type]: Title" \
  --body-file /tmp/zenmux-issue-body.md \
  --label "label1"
```

After success, show the issue URL and clean up the temp file (`rm /tmp/zenmux-issue-body.md`).

## Step 6: After submission

- Share the issue URL with the user
- Mention the [public roadmap](https://github.com/orgs/ZenMux/projects/2) — they can track progress there
- For discussions or questions that aren't quite issues, suggest [GitHub Discussions](https://github.com/ZenMux/zenmux-doc/discussions) or the [Discord community](http://discord.gg/vHZZzj84Bm)
- Thank them — every contribution matters when building in public

## Language

Respond in whatever language the user is using. If they write in Chinese, conduct the conversation and compose the issue in Chinese. If in English, use English. The ZenMux team reads both.

## Proactive engagement

If during a conversation (especially when using the zenmux-context skill) you notice the user has hit a real problem or has a strong product opinion, gently offer: "Would you like me to help submit this as an issue/suggestion to ZenMux? It helps the team prioritize." Don't push — just make the option visible.
