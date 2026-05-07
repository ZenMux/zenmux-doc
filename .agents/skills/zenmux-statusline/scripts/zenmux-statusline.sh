#!/bin/bash
# ZenMux Status Line for Claude Code
# Line 1: session info (model, dir, git, context used, cache tokens)
# Line 2: ZenMux account (plan, quota usage, PAYG wallet balance)
# Requires: curl, jq; ZENMUX_MANAGEMENT_KEY env var for account data

set -o pipefail

# ── Colors ───────────────────────────────────────────────────────────
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
MAGENTA='\033[35m'
DIM='\033[2m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ──────────────────────────────────────────────────────────
# Format large numbers: 856 → "856", 15234 → "15.2k", 1523400 → "1.5M"
fmt_num() {
    local n=${1:-0}
    if [ "$n" -ge 1000000 ] 2>/dev/null; then
        awk "BEGIN{printf \"%.1fM\", $n/1000000}"
    elif [ "$n" -ge 1000 ] 2>/dev/null; then
        awk "BEGIN{printf \"%.1fk\", $n/1000}"
    else
        echo "$n"
    fi
}

# Format ISO 8601 UTC timestamp → "Xh Ym" or "Xm" from now
fmt_time_until() {
    local iso_ts=$1
    [ -z "$iso_ts" ] || [ "$iso_ts" = "null" ] && return 1
    local clean_ts
    clean_ts=$(echo "$iso_ts" | sed 's/\.[0-9]*Z$//' | sed 's/Z$//')
    local now target
    now=$(date -u +%s)
    if target=$(date -j -u -f "%Y-%m-%dT%H:%M:%S" "$clean_ts" +%s 2>/dev/null); then
        :
    elif target=$(date -u -d "$iso_ts" +%s 2>/dev/null); then
        :
    else
        return 1
    fi
    local diff=$(( target - now ))
    [ "$diff" -le 0 ] && echo "soon" && return 0
    local hours=$(( diff / 3600 ))
    local mins=$(( (diff % 3600) / 60 ))
    if [ "$hours" -gt 0 ]; then
        echo "${hours}h${mins}m"
    else
        echo "${mins}m"
    fi
}

# ── Read Claude Code session data from stdin ─────────────────────────
input=$(cat)

MODEL_ID=$(echo "$input" | jq -r '.model.id // .model.display_name // "?"')
DIR=$(echo "$input" | jq -r '.workspace.current_dir // .cwd // ""')
USED_PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

# current_usage: token breakdown from the last API call (null before first call)
CACHE_READ=$(echo "$input" | jq -r '.context_window.current_usage.cache_read_input_tokens // 0')
CACHE_WRITE=$(echo "$input" | jq -r '.context_window.current_usage.cache_creation_input_tokens // 0')

# ── Context used bar ────────────────────────────────────────────────
if [ "$USED_PCT" -ge 90 ] 2>/dev/null; then CTX_COLOR="$RED"
elif [ "$USED_PCT" -ge 70 ] 2>/dev/null; then CTX_COLOR="$YELLOW"
else CTX_COLOR="$GREEN"; fi

BAR_WIDTH=10
CTX_FILLED=$(( USED_PCT * BAR_WIDTH / 100 ))
CTX_EMPTY=$(( BAR_WIDTH - CTX_FILLED ))
CTX_BAR=""
[ "$CTX_FILLED" -gt 0 ] && printf -v FILL "%${CTX_FILLED}s" && CTX_BAR="${FILL// /█}"
[ "$CTX_EMPTY" -gt 0 ] && printf -v PAD "%${CTX_EMPTY}s" && CTX_BAR="${CTX_BAR}${PAD// /░}"

# ── Format session metrics ───────────────────────────────────────────
C_READ=$(fmt_num "$CACHE_READ")
C_WRITE=$(fmt_num "$CACHE_WRITE")

# Cache section: only show when current_usage is available (after first API call)
CACHE_PART=""
if [ "$CACHE_READ" -gt 0 ] 2>/dev/null || [ "$CACHE_WRITE" -gt 0 ] 2>/dev/null; then
    CACHE_PART=" ${DIM}|${RESET} 💾 ${DIM}r${RESET}${C_READ} ${DIM}w${RESET}${C_WRITE}"
fi

# ── Git branch (cached per session, 5s TTL) ─────────────────────────
SESSION_ID=$(echo "$input" | jq -r '.session_id // "default"')
GIT_CACHE="/tmp/zenmux-sl-git-${SESSION_ID}"
GIT_CACHE_AGE=5

cache_is_stale() {
    local file=$1 max_age=$2
    [ ! -f "$file" ] && return 0
    local now; now=$(date +%s)
    local mtime; mtime=$(stat -f %m "$file" 2>/dev/null || stat -c %Y "$file" 2>/dev/null || echo 0)
    [ $(( now - mtime )) -gt "$max_age" ]
}

if cache_is_stale "$GIT_CACHE" "$GIT_CACHE_AGE"; then
    if git rev-parse --git-dir > /dev/null 2>&1; then
        BRANCH=$(git branch --show-current 2>/dev/null)
        DIRTY=""
        [ -n "$(git status --porcelain 2>/dev/null | head -1)" ] && DIRTY="*"
        echo "${BRANCH}${DIRTY}" > "$GIT_CACHE"
    else
        echo "" > "$GIT_CACHE"
    fi
fi
GIT_INFO=$(cat "$GIT_CACHE" 2>/dev/null || echo "")

# ── Line 1: Claude session info ─────────────────────────────────────
GIT_PART=""
[ -n "$GIT_INFO" ] && GIT_PART=" ${DIM}|${RESET} 🌿 ${GIT_INFO}"

printf '%b' "${CYAN}${BOLD}[${MODEL_ID}]${RESET} 📁 ${DIR##*/}${GIT_PART} ${DIM}|${RESET} ${CTX_COLOR}${CTX_BAR}${RESET} ${USED_PCT}% ctx${CACHE_PART}\n"

# ── ZenMux account data (Line 2) ────────────────────────────────────
# If management key is not set, show a setup hint
if [ -z "$ZENMUX_MANAGEMENT_KEY" ]; then
    printf '%b' "${DIM}⚙ Set${RESET} ${YELLOW}ZENMUX_MANAGEMENT_KEY${RESET} ${DIM}to display account data →${RESET} ${CYAN}zenmux.ai/platform/management${RESET}\n"
    exit 0
fi

# Cache config: shared across sessions, 120s TTL
ZENMUX_CACHE="/tmp/zenmux-sl-account-cache"
ZENMUX_CACHE_AGE=120

if cache_is_stale "$ZENMUX_CACHE" "$ZENMUX_CACHE_AGE"; then
    # Fetch subscription detail and PAYG balance in parallel
    SUB_TMP=$(mktemp)
    PAYG_TMP=$(mktemp)

    curl -s --max-time 5 "https://zenmux.ai/api/v1/management/subscription/detail" \
        -H "Authorization: Bearer $ZENMUX_MANAGEMENT_KEY" > "$SUB_TMP" &
    PID_SUB=$!

    curl -s --max-time 5 "https://zenmux.ai/api/v1/management/payg/balance" \
        -H "Authorization: Bearer $ZENMUX_MANAGEMENT_KEY" > "$PAYG_TMP" &
    PID_PAYG=$!

    wait $PID_SUB $PID_PAYG 2>/dev/null

    # Merge into a single cache JSON
    SUB_DATA=$(cat "$SUB_TMP")
    PAYG_DATA=$(cat "$PAYG_TMP")
    rm -f "$SUB_TMP" "$PAYG_TMP"

    # Validate subscription response before caching
    if echo "$SUB_DATA" | jq -e '.data' > /dev/null 2>&1; then
        jq -n --argjson sub "$SUB_DATA" --argjson payg "$PAYG_DATA" \
            '{sub: $sub, payg: $payg}' > "$ZENMUX_CACHE" 2>/dev/null
    fi
fi

# If no cache available, skip ZenMux line
[ ! -f "$ZENMUX_CACHE" ] && exit 0

CACHED=$(cat "$ZENMUX_CACHE")

# ── Parse subscription data ──────────────────────────────────────────
PLAN_RAW=$(echo "$CACHED" | jq -r '.sub.data.plan.tier // "—"')
PLAN=$(echo "$PLAN_RAW" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
STATUS=$(echo "$CACHED" | jq -r '.sub.data.account_status // "unknown"')

# 5-hour quota (usage_percentage is a 0–1 decimal)
FIVE_H_PCT=$(echo "$CACHED" | jq -r '.sub.data.quota_5_hour.usage_percentage // 0')
FIVE_H_PCT_INT=$(echo "$FIVE_H_PCT" | awk '{printf "%.0f", $1 * 100}')

# 7-day quota
SEVEN_D_PCT=$(echo "$CACHED" | jq -r '.sub.data.quota_7_day.usage_percentage // 0')
SEVEN_D_PCT_INT=$(echo "$SEVEN_D_PCT" | awk '{printf "%.0f", $1 * 100}')

# ── Build quota mini-bars (usage: higher = worse) ───────────────────
make_usage_bar() {
    local pct=$1 width=5
    local filled=$(( pct * width / 100 ))
    # Any non-zero usage should show at least one block, otherwise the bar
    # looks empty (e.g. 19% with width=5 floors to 0 filled blocks).
    [ "$pct" -gt 0 ] && [ "$filled" -lt 1 ] && filled=1
    [ "$filled" -gt "$width" ] && filled=$width
    local empty=$(( width - filled ))
    local color
    if [ "$pct" -ge 90 ]; then color="$RED"
    elif [ "$pct" -ge 70 ]; then color="$YELLOW"
    else color="$GREEN"; fi
    local bar=""
    [ "$filled" -gt 0 ] && printf -v f "%${filled}s" && bar="${f// /█}"
    [ "$empty" -gt 0 ] && printf -v e "%${empty}s" && bar="${bar}${e// /░}"
    printf '%b' "${color}${bar}${RESET}"
}

FIVE_BAR=$(make_usage_bar "$FIVE_H_PCT_INT")
SEVEN_BAR=$(make_usage_bar "$SEVEN_D_PCT_INT")

# ── 5-hour quota reset countdown (shown when fully used) ────────────
FIVE_H_RESET_PART=""
FIVE_H_RESETS_AT=$(echo "$CACHED" | jq -r '.sub.data.quota_5_hour.resets_at // "null"')
if [ "$FIVE_H_PCT_INT" -ge 100 ] 2>/dev/null && FIVE_H_ETA=$(fmt_time_until "$FIVE_H_RESETS_AT"); then
    FIVE_H_RESET_PART=" ${YELLOW}⏳ ${FIVE_H_ETA}${RESET}"
fi

SEVEN_D_RESET_PART=""
SEVEN_D_RESETS_AT=$(echo "$CACHED" | jq -r '.sub.data.quota_7_day.resets_at // "null"')
if [ "$SEVEN_D_PCT_INT" -ge 100 ] 2>/dev/null && SEVEN_D_ETA=$(fmt_time_until "$SEVEN_D_RESETS_AT"); then
    SEVEN_D_RESET_PART=" ${YELLOW}⏳ ${SEVEN_D_ETA}${RESET}"
fi

# ── Parse PAYG wallet balance ────────────────────────────────────────
PAYG_TOTAL=$(echo "$CACHED" | jq -r '.payg.data.total_credits // empty')
PAYG_PART=""
if [ -n "$PAYG_TOTAL" ] && [ "$PAYG_TOTAL" != "null" ]; then
    PAYG_FMT=$(printf '$%.2f' "$PAYG_TOTAL")
    # 💳 + "Bal" makes it clear this is available wallet balance, not consumption
    PAYG_PART=" ${DIM}|${RESET} 💳 Bal ${GREEN}${BOLD}${PAYG_FMT}${RESET}"
fi

# ── API Key type + masked display ────────────────────────────────────
KEY_PART=""
if [ -n "$ZENMUX_API_KEY" ]; then
    KEY_RAW="$ZENMUX_API_KEY"
    # Extract type prefix (e.g. sk-ss, sk-ai) and last 3 chars
    KEY_PREFIX=$(echo "$KEY_RAW" | grep -oE '^sk-[a-z]+' || echo "")
    KEY_SUFFIX="${KEY_RAW: -3}"
    if [ -n "$KEY_PREFIX" ]; then
        KEY_MASKED="${KEY_PREFIX}-...${KEY_SUFFIX}"
    else
        KEY_MASKED="${KEY_RAW:0:5}...${KEY_SUFFIX}"
    fi
    # Determine key type: sk-ss-v1 = Subscription, sk-ai-v1 = PAYG
    case "$KEY_RAW" in
        sk-ss-v1-*) KEY_TYPE="Sub"  ; KEY_TYPE_COLOR="$CYAN" ;;
        sk-ai-v1-*) KEY_TYPE="PAYG" ; KEY_TYPE_COLOR="$YELLOW" ;;
        *)          KEY_TYPE="Key"  ; KEY_TYPE_COLOR="$DIM" ;;
    esac
    KEY_PART=" ${DIM}|${RESET} 🔑 ${KEY_TYPE_COLOR}${KEY_TYPE}${RESET} ${DIM}${KEY_MASKED}${RESET}"
fi

# ── Status indicator ─────────────────────────────────────────────────
if [ "$STATUS" = "healthy" ]; then
    STATUS_PART="${MAGENTA}${BOLD}⚡ ZenMux ${PLAN}${RESET}"
else
    STATUS_PART="${RED}${BOLD}⚡ ZenMux ${PLAN} ⚠${RESET}"
fi

# ── Line 2: ZenMux account info ─────────────────────────────────────
printf '%b' "${STATUS_PART}${KEY_PART} ${DIM}|${RESET} 5h ${FIVE_BAR} ${FIVE_H_PCT_INT}%${FIVE_H_RESET_PART} ${DIM}·${RESET} 7d ${SEVEN_BAR} ${SEVEN_D_PCT_INT}%${SEVEN_D_RESET_PART}${PAYG_PART}\n"
