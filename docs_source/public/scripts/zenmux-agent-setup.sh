#!/bin/sh

set -eu

SCRIPT_NAME="zenmux-agent-setup"
SUPPORTED_AGENTS="codex,claude-code,gemini-cli,opencode,neovate"
AGENTS=""
MODE="configure"
API_KEY="${ZENMUX_API_KEY:-}"
CODEX_MODEL=""
GEMINI_MODEL="google/gemini-3.5-flash"
SHELL_PROFILE=""
TIMESTAMP="$(date +%Y%m%d%H%M%S)"

log() {
 printf '%s\n' "[$SCRIPT_NAME] $*"
}

warn() {
 printf '%s\n' "[$SCRIPT_NAME] WARNING: $*" >&2
}

die() {
 printf '%s\n' "[$SCRIPT_NAME] ERROR: $*" >&2
 exit 1
}

usage() {
 cat <<'EOF'
Configure ZenMux for installed coding agents on macOS and Linux.

Usage:
 zenmux-agent-setup.sh [options]
 zenmux-agent-setup.sh --restore

Options:
 --agents <list> Comma-separated agents. If omitted, show an
 interactive menu with installation status.
 Supported: codex, claude-code, gemini-cli,
 opencode, neovate
 --api-key <key> ZenMux API Key. If omitted, read from
 ZENMUX_API_KEY or prompt securely.
 --codex-model <model> Optionally override the Codex model.
 --gemini-model <model> Override the Gemini CLI model. The default is
 google/gemini-3.5-flash.
 --shell-profile <path> Shell profile to update. Auto-detected by default.
 --restore Restore files from the most recent setup run.
 -h, --help Show this help.

Examples:
 sh zenmux-agent-setup.sh
 sh zenmux-agent-setup.sh --agents codex,claude-code
 sh zenmux-agent-setup.sh --restore
EOF
}

while [ "$#" -gt 0 ]; do
 case "$1" in
 --agents)
 [ "$#" -ge 2 ] || die "--agents requires a value"
 AGENTS="$2"
 shift 2
 ;;
 --api-key)
 [ "$#" -ge 2 ] || die "--api-key requires a value"
 API_KEY="$2"
 shift 2
 ;;
 --codex-model)
 [ "$#" -ge 2 ] || die "--codex-model requires a value"
 CODEX_MODEL="$2"
 shift 2
 ;;
 --gemini-model)
 [ "$#" -ge 2 ] || die "--gemini-model requires a value"
 GEMINI_MODEL="$2"
 shift 2
 ;;
 --shell-profile)
 [ "$#" -ge 2 ] || die "--shell-profile requires a value"
 SHELL_PROFILE="$2"
 shift 2
 ;;
 --restore)
 MODE="restore"
 shift
 ;;
 -h|--help)
 usage
 exit 0
 ;;
 *)
 die "unknown option: $1"
 ;;
 esac
done

case "$(uname -s 2>/dev/null || printf unknown)" in
 Darwin|Linux) ;;
 *) die "only macOS and Linux are supported" ;;
esac

[ -n "${HOME:-}" ] || die "HOME is not set"
umask 077

BACKUP_ROOT="$HOME/.config/zenmux-agent-setup/backups"

restore_last_run() {
 latest=""
 if [ -d "$BACKUP_ROOT" ]; then
 for candidate in "$BACKUP_ROOT"/[0-9]*; do
 [ -d "$candidate" ] || continue
 latest="$candidate"
 done
 fi

 [ -n "$latest" ] || die "no restorable setup run was found"
 manifest="$latest/manifest.tsv"
 [ -s "$manifest" ] || die "backup manifest is missing: $manifest"

 log "restoring setup run: $(basename "$latest")"
 tab=$(printf '\t')
 while IFS="$tab" read -r original stored state original_mode; do
 [ -n "$original" ] || continue
 case "$state" in
 existing)
 mkdir -p "$(dirname "$original")"
 cp "$stored" "$original"
 if [ -n "$original_mode" ]; then
 chmod "$original_mode" "$original"
 fi
 log "restored: $original"
 ;;
 missing)
 rm -f "$original"
 log "removed file created by setup: $original"
 ;;
 *) die "invalid backup state for $original" ;;
 esac
 done < "$manifest"

 restored="$BACKUP_ROOT/restored-$(basename "$latest")-$TIMESTAMP"
 mv "$latest" "$restored"
 log "restore complete"
 log "restart running agents so they reload the restored configuration"
}

if [ "$MODE" = "restore" ]; then
 restore_last_run
 exit 0
fi

if [ -n "$CODEX_MODEL" ]; then
 case "$CODEX_MODEL" in
 *[!A-Za-z0-9._/-]*) die "invalid Codex model name" ;;
 esac
fi

if [ -n "$GEMINI_MODEL" ]; then
 case "$GEMINI_MODEL" in
 *[!A-Za-z0-9._/-]*) die "invalid Gemini model name" ;;
 esac
fi

agent_installed() {
 case "$1" in
 codex)
 command -v codex >/dev/null 2>&1 ||
 [ -d "/Applications/Codex.app" ] ||
 [ -d "$HOME/Applications/Codex.app" ]
 ;;
 claude-code) command -v claude >/dev/null 2>&1 ;;
 gemini-cli) command -v gemini >/dev/null 2>&1 ;;
 opencode) command -v opencode >/dev/null 2>&1 ;;
 neovate)
 command -v neovate >/dev/null 2>&1 || command -v neo >/dev/null 2>&1
 ;;
 *) return 1 ;;
 esac
}

agent_status() {
 if agent_installed "$1"; then
 printf '%s' 'installed'
 else
 printf '%s' 'not found'
 fi
}

append_agent() {
 agent=$1
 case ",$AGENTS," in
 *",$agent,"*) ;;
 *)
 if [ -n "$AGENTS" ]; then
 AGENTS="$AGENTS,$agent"
 else
 AGENTS="$agent"
 fi
 ;;
 esac
}

select_agents_interactively() {
 [ -r /dev/tty ] || die "--agents is required when no interactive terminal is available"

 cat > /dev/tty <<EOF

ZenMux Agent Setup
Select one or more installed agents (comma-separated numbers):

 1) Codex CLI / Codex App [$(agent_status codex)]
 2) Claude Code [$(agent_status claude-code)]
 3) Gemini CLI [$(agent_status gemini-cli)]
 4) OpenCode [$(agent_status opencode)]
 5) Neovate Code [$(agent_status neovate)]
 a) All detected agents
 r) Restore the previous setup run

Selection:
EOF
 IFS= read -r selection < /dev/tty || die "could not read selection"

 case "$selection" in
 r|R)
 restore_last_run
 exit 0
 ;;
 a|A)
 AGENTS="$SUPPORTED_AGENTS"
 return
 ;;
 esac

 AGENTS=""
 old_ifs=$IFS
 IFS=,
 for choice in $selection; do
 choice=$(printf '%s' "$choice" | tr -d '[:space:]')
 case "$choice" in
 1) append_agent codex ;;
 2) append_agent claude-code ;;
 3) append_agent gemini-cli ;;
 4) append_agent opencode ;;
 5) append_agent neovate ;;
 *) die "invalid selection: $choice" ;;
 esac
 done
 IFS=$old_ifs
 [ -n "$AGENTS" ] || die "no agent selected"
}

if [ -z "$AGENTS" ]; then
 select_agents_interactively
fi

validate_agent_names() {
 old_ifs=$IFS
 IFS=,
 for agent in $AGENTS; do
 case "$agent" in
 codex|claude-code|gemini-cli|opencode|neovate) ;;
 *) die "unsupported agent: $agent" ;;
 esac
 done
 IFS=$old_ifs
}

filter_installed_agents() {
 requested=$AGENTS
 AGENTS=""
 old_ifs=$IFS
 IFS=,
 for agent in $requested; do
 if agent_installed "$agent"; then
 append_agent "$agent"
 else
 warn "$agent was not detected and will be skipped"
 fi
 done
 IFS=$old_ifs
 [ -n "$AGENTS" ] || die "none of the selected agents were detected"
}

validate_agent_names
filter_installed_agents
log "selected installed agents: $AGENTS"

case "$API_KEY" in
 '')
 [ -r /dev/tty ] || die "no API Key supplied and no interactive terminal is available"
 printf 'ZenMux API Key: ' > /dev/tty
 if command -v stty >/dev/null 2>&1; then
 stty -echo < /dev/tty 2>/dev/null || true
 fi
 IFS= read -r API_KEY < /dev/tty || true
 if command -v stty >/dev/null 2>&1; then
 stty echo < /dev/tty 2>/dev/null || true
 fi
 printf '\n' > /dev/tty
 ;;
esac

case "$API_KEY" in
 *[!A-Za-z0-9._-]*|'') die "invalid API Key format" ;;
esac

case "$API_KEY" in
 sk-ss-v1-*|sk-ai-v1-*) ;;
 *) warn "API Key does not use the usual sk-ss-v1- or sk-ai-v1- prefix" ;;
esac

has_agent() {
 case ",$AGENTS," in
 *",$1,"*) return 0 ;;
 *) return 1 ;;
 esac
}

detect_shell_profile() {
 if [ -n "$SHELL_PROFILE" ]; then
 printf '%s\n' "$SHELL_PROFILE"
 return
 fi

 shell_name=$(basename "${SHELL:-sh}")
 os_name=$(uname -s 2>/dev/null || printf unknown)
 case "$shell_name" in
 zsh) printf '%s\n' "$HOME/.zshrc" ;;
 bash)
 if [ "$os_name" = "Darwin" ]; then
 printf '%s\n' "$HOME/.bash_profile"
 else
 printf '%s\n' "$HOME/.bashrc"
 fi
 ;;
 *) printf '%s\n' "$HOME/.profile" ;;
 esac
}

SHELL_PROFILE=$(detect_shell_profile)

refuse_symbolic_link() {
 file=$1
 if [ -L "$file" ]; then
 die "refusing to replace symbolic link: $file"
 fi
}

# Check every selected destination before changing anything. Replacing a
# symlink atomically would replace the link itself rather than its target.
refuse_symbolic_link "$SHELL_PROFILE"
if has_agent codex; then
 refuse_symbolic_link "$HOME/.codex/config.toml"
fi
if has_agent gemini-cli; then
 refuse_symbolic_link "$HOME/.gemini/.env"
 refuse_symbolic_link "$HOME/.gemini/settings.json"
fi

RUN_BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP-$$"
MANIFEST="$RUN_BACKUP_DIR/manifest.tsv"
BACKUP_SEQUENCE=0
mkdir -p "$RUN_BACKUP_DIR/files"
: > "$MANIFEST"

backup_file() {
 file=$1
 BACKUP_SEQUENCE=$((BACKUP_SEQUENCE + 1))
 stored="$RUN_BACKUP_DIR/files/$BACKUP_SEQUENCE"
 if [ -e "$file" ]; then
 case "$(uname -s 2>/dev/null || printf unknown)" in
 Darwin) original_mode=$(stat -f '%Lp' "$file") ;;
 Linux) original_mode=$(stat -c '%a' "$file") ;;
 *) die "could not read file permissions: $file" ;;
 esac
 cp "$file" "$stored"
 printf '%s\t%s\texisting\t%s\n' "$file" "$stored" "$original_mode" >> "$MANIFEST"
 if [ -s "$file" ]; then
 visible_backup="$file.bak.$TIMESTAMP"
 cp "$file" "$visible_backup"
 log "backup: $visible_backup"
 fi
 else
 : > "$stored"
 printf '%s\t%s\tmissing\t\n' "$file" "$stored" >> "$MANIFEST"
 fi
}

replace_managed_block() {
 file=$1
 start_marker=$2
 end_marker=$3
 content_file=$4
 temp_file=$(mktemp "${TMPDIR:-/tmp}/zenmux-managed.XXXXXX")

 if [ -f "$file" ]; then
 awk -v start="$start_marker" -v end="$end_marker" '
 $0 == start { skip = 1; next }
 $0 == end { skip = 0; next }
 !skip { print }
 ' "$file" > "$temp_file"
 fi

 if [ -s "$temp_file" ]; then
 printf '\n' >> "$temp_file"
 fi
 printf '%s\n' "$start_marker" >> "$temp_file"
 cat "$content_file" >> "$temp_file"
 printf '%s\n' "$end_marker" >> "$temp_file"
 mv "$temp_file" "$file"
}

backup_file "$SHELL_PROFILE"
mkdir -p "$(dirname "$SHELL_PROFILE")"
[ -e "$SHELL_PROFILE" ] || : > "$SHELL_PROFILE"

COMMON_START="# >>> ZenMux Agent Setup: API Key >>>"
COMMON_END="# <<< ZenMux Agent Setup: API Key <<<"
common_content=$(mktemp "${TMPDIR:-/tmp}/zenmux-common.XXXXXX")
printf "export ZENMUX_API_KEY='%s'\n" "$API_KEY" > "$common_content"
replace_managed_block "$SHELL_PROFILE" "$COMMON_START" "$COMMON_END" "$common_content"
rm -f "$common_content"
log "configured shared API Key in $SHELL_PROFILE"

configure_codex() {
 codex_dir="$HOME/.codex"
 codex_config="$codex_dir/config.toml"
 backup_file "$codex_config"
 mkdir -p "$codex_dir"
 [ -e "$codex_config" ] || : > "$codex_config"

 cleaned=$(mktemp "${TMPDIR:-/tmp}/zenmux-codex-clean.XXXXXX")
 output=$(mktemp "${TMPDIR:-/tmp}/zenmux-codex-output.XXXXXX")

 replace_model=0
 [ -z "$CODEX_MODEL" ] || replace_model=1
 awk -v replace_model="$replace_model" '
 $0 == "# >>> ZenMux Agent Setup: Codex defaults >>>" { managed = 1; next }
 $0 == "# <<< ZenMux Agent Setup: Codex defaults <<<" { managed = 0; next }
 $0 == "# >>> ZenMux Agent Setup: Codex provider >>>" { managed = 1; next }
 $0 == "# <<< ZenMux Agent Setup: Codex provider <<<" { managed = 0; next }
 managed { next }
 /^\[model_providers\.zenmux\][[:space:]]*$/ { zenmux = 1; next }
 zenmux && /^\[/ { zenmux = 0 }
 zenmux { next }
 !seen_table && /^[[:space:]]*model_provider[[:space:]]*=/ { next }
 !seen_table && replace_model == 1 && /^[[:space:]]*model[[:space:]]*=/ { next }
 /^\[/ { seen_table = 1 }
 { print }
 ' "$codex_config" > "$cleaned"

 {
 printf '%s\n' "# >>> ZenMux Agent Setup: Codex defaults >>>"
 printf 'model_provider = "zenmux"\n'
 if [ -n "$CODEX_MODEL" ]; then
 printf 'model = "%s"\n' "$CODEX_MODEL"
 fi
 printf '%s\n\n' "# <<< ZenMux Agent Setup: Codex defaults <<<"
 cat "$cleaned"
 [ ! -s "$cleaned" ] || printf '\n'
 printf '%s\n' "# >>> ZenMux Agent Setup: Codex provider >>>"
 printf '%s\n' '[model_providers.zenmux]'
 printf '%s\n' 'name = "ZenMux"'
 printf '%s\n' 'base_url = "https://zenmux.ai/api/v1"'
 printf '%s\n' 'env_key = "ZENMUX_API_KEY"'
 printf '%s\n' 'wire_api = "responses"'
 printf '%s\n' "# <<< ZenMux Agent Setup: Codex provider <<<"
 } > "$output"

 mv "$output" "$codex_config"
 rm -f "$cleaned"
 chmod 600 "$codex_config"
 log "configured Codex: $codex_config"
}

configure_claude_code() {
 start="# >>> ZenMux Agent Setup: Claude Code >>>"
 end="# <<< ZenMux Agent Setup: Claude Code <<<"
 content=$(mktemp "${TMPDIR:-/tmp}/zenmux-claude.XXXXXX")
 cat > "$content" <<'EOF'
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"
export ANTHROPIC_AUTH_TOKEN="$ZENMUX_API_KEY"
export ANTHROPIC_API_KEY=""
export CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS="1"
export CLAUDE_CODE_ATTRIBUTION_HEADER="0"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
export API_TIMEOUT_MS="30000000"
EOF
 replace_managed_block "$SHELL_PROFILE" "$start" "$end" "$content"
 rm -f "$content"
 log "configured Claude Code in $SHELL_PROFILE"
}

configure_gemini_cli() {
 gemini_dir="$HOME/.gemini"
 env_file="$gemini_dir/.env"
 settings_file="$gemini_dir/settings.json"
 backup_file "$env_file"
 backup_file "$settings_file"
 mkdir -p "$gemini_dir"
 [ -e "$env_file" ] || : > "$env_file"

 start="# >>> ZenMux Agent Setup: Gemini CLI >>>"
 end="# <<< ZenMux Agent Setup: Gemini CLI <<<"
 content=$(mktemp "${TMPDIR:-/tmp}/zenmux-gemini.XXXXXX")
 {
 printf 'GEMINI_API_KEY=%s\n' "$API_KEY"
 if [ -n "$GEMINI_MODEL" ]; then
 printf 'GEMINI_MODEL=%s\n' "$GEMINI_MODEL"
 fi
 printf '%s\n' 'GOOGLE_GEMINI_BASE_URL=https://zenmux.ai/api/vertex-ai'
 } > "$content"
 replace_managed_block "$env_file" "$start" "$end" "$content"
 rm -f "$content"
 chmod 600 "$env_file"

 shell_start="# >>> ZenMux Agent Setup: Gemini CLI shell >>>"
 shell_end="# <<< ZenMux Agent Setup: Gemini CLI shell <<<"
 shell_content=$(mktemp "${TMPDIR:-/tmp}/zenmux-gemini-shell.XXXXXX")
 {
 printf '%s\n' 'export GEMINI_API_KEY="$ZENMUX_API_KEY"'
 if [ -n "$GEMINI_MODEL" ]; then
 printf 'export GEMINI_MODEL="%s"\n' "$GEMINI_MODEL"
 fi
 printf '%s\n' 'export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"'
 } > "$shell_content"
 replace_managed_block "$SHELL_PROFILE" "$shell_start" "$shell_end" "$shell_content"
 rm -f "$shell_content"

 if [ ! -s "$settings_file" ]; then
 cat > "$settings_file" <<'EOF'
{
 "security": {
 "auth": {
 "selectedType": "gemini-api-key"
 }
 }
}
EOF
 chmod 600 "$settings_file"
 log "configured Gemini CLI auth: $settings_file"
 elif command -v node >/dev/null 2>&1; then
 if node - "$settings_file" <<'EOF'
const fs = require('fs');
const file = process.argv[2];
try {
 const config = JSON.parse(fs.readFileSync(file, 'utf8'));
 config.security = config.security || {};
 config.security.auth = config.security.auth || {};
 config.security.auth.selectedType = 'gemini-api-key';
 fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\n', { mode: 0o600 });
} catch (error) {
 console.error(error.message);
 process.exit(1);
}
EOF
 then
 log "updated Gemini CLI auth: $settings_file"
 else
 warn "could not parse $settings_file; environment was configured but selectedType was not changed"
 fi
 else
 warn "Node.js is unavailable; environment was configured but existing $settings_file was not changed"
 fi

 log "configured Gemini CLI: $env_file"
}

has_agent codex && configure_codex
has_agent claude-code && configure_claude_code
has_agent gemini-cli && configure_gemini_cli
has_agent opencode && log "configured OpenCode through ZENMUX_API_KEY"
has_agent neovate && log "configured Neovate Code through ZENMUX_API_KEY"

printf '\n'
log "setup complete"
log "restore this run with: sh zenmux-agent-setup.sh --restore"
log "reload your shell with: . $SHELL_PROFILE"
log "restart any running desktop app or agent process to load the new configuration"
