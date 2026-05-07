---
name: zenmux-statusline
description: >-
  Install and configure a Claude Code status line that displays real-time ZenMux account
  information: subscription tier, 5-hour and 7-day quota usage with color-coded progress
  bars, and PAYG wallet balance, alongside standard session info (model, git, context
  usage, prompt cache). Trigger on: "status line", "statusline", "set up status bar", "show ZenMux in
  status bar", "install ZenMux statusline", "configure status line with ZenMux",
  "状态栏", "配置状态栏", "安装状态栏", "在状态栏显示ZenMux信息".
  Activate when user wants to SET UP, INSTALL, CONFIGURE, or CUSTOMIZE a Claude Code
  status line that includes ZenMux account data. Do NOT trigger for querying usage
  interactively (use zenmux-usage), docs (use zenmux-context), or general setup
  (use zenmux-setup).
---

# zenmux-statusline

You are installing a Claude Code status line that displays real-time ZenMux account information alongside standard session data.

The status line script is bundled at `scripts/zenmux-statusline.sh` relative to this skill. It produces a two-line display:

```
Line 1: [model-slug] 📁 dir | 🌿 branch | █████░░░░░ 58% ctx | 💾 r72.0k w5.0k
Line 2: ⚡ Ultra | 🔑 Sub sk-ss-...6e6 | 5h █░░░░ 19% · 7d █░░░░ 24% | 💳 Bal $492.74
```

If `ZENMUX_MANAGEMENT_KEY` is not set, Line 2 shows a setup hint instead:
```
Line 2: ⚙ Set ZENMUX_MANAGEMENT_KEY to display account data → zenmux.ai/platform/management
```

Follow these steps in order.

---

## Step 1 — Verify prerequisites

### 1a. Check that `curl` and `jq` are available

```bash
command -v curl && command -v jq
```

If either is missing, tell the user to install it (`brew install jq` on macOS, or the appropriate package manager).

### 1b. Check the Management API Key

```bash
echo "${ZENMUX_MANAGEMENT_KEY:+set}"
```

- If the output is `set` — proceed to Step 2.
- If empty — inform the user:

  > The status line needs `ZENMUX_MANAGEMENT_KEY` to fetch account data.
  > Create one at https://zenmux.ai/platform/management, then add to your shell profile:
  > ```
  > export ZENMUX_MANAGEMENT_KEY="sk-mg-v1-..."
  > ```
  > Without the key, the status line will still show session info (model, git, context remaining) and display a setup hint on Line 2.

  The user can proceed without the key — the script degrades gracefully and shows a hint on how to configure it.

---

## Step 2 — Install the status line script

Determine the absolute path to the bundled script. It lives next to this SKILL.md:

```bash
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
# Falls back to the skill directory path from the skills install location
```

Copy it to the Claude Code config directory:

```bash
cp "SKILL_SCRIPTS_DIR/zenmux-statusline.sh" ~/.claude/zenmux-statusline.sh
chmod +x ~/.claude/zenmux-statusline.sh
```

Where `SKILL_SCRIPTS_DIR` is the `scripts/` directory inside this skill. Use the actual resolved path.

If the user already has a `~/.claude/statusline*.sh` file, inform them that it will be replaced and confirm before overwriting.

---

## Step 3 — Configure Claude Code settings

Read the user's current settings:

```bash
cat ~/.claude/settings.json
```

Update the `statusLine` field to point to the new script. Preserve all other settings. The target configuration:

```json
{
  "statusLine": {
    "type": "command",
    "command": "sh ~/.claude/zenmux-statusline.sh",
    "refreshInterval": 120
  }
}
```

The `refreshInterval: 120` re-runs the script every 120 seconds so the ZenMux data refreshes even during idle periods, matching the cache TTL.

Use the Edit tool to update the settings file. Be careful to preserve the existing JSON structure.

---

## Step 4 — Verify the installation

Test the script with mock input to confirm it runs without errors:

```bash
echo '{"model":{"id":"test-model"},"workspace":{"current_dir":"'$(pwd)'"},"context_window":{"used_percentage":0},"session_id":"verify-install"}' | sh ~/.claude/zenmux-statusline.sh
```

If output appears (at least one line), the installation is successful.

Tell the user:

> Status line installed. It will appear at the bottom of Claude Code on your next interaction.
>
> **What it shows:**
> - **Line 1**: Model slug, directory, git branch, context used bar, last-call prompt cache read/write
> - **Line 2**: ZenMux plan tier, API key type + masked key, 5-hour and 7-day quota usage with color-coded bars, PAYG wallet balance
>
> **Colors**:
> - Context used: Green (<70%), yellow (70–89%), red (90%+)
> - Quota usage: Green (<70%), yellow (70–89%), red (90%+)
>
> **Caching**: ZenMux API data is cached for 120 seconds to keep the status line fast. Git data is cached for 5 seconds.
>
> To remove it later, delete the `statusLine` field from `~/.claude/settings.json`.

---

## Communication guidelines

- Respond in the same language the user writes in (Chinese → Chinese, English → English).
- If any step fails, diagnose the error clearly and suggest a fix before moving on.
- Do not make changes to `~/.claude/settings.json` without showing the user what will change.
