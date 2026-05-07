#!/bin/bash

# Make .agents/skills the single source of truth for skills.
# .claude/skills remains a directory containing per-skill symlinks.
# Usage: ./scripts/sync-claude-skills-to-agents.sh [--dry-run]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CANONICAL_DIR="$PROJECT_ROOT/.agents/skills"
CLAUDE_DIR="$PROJECT_ROOT/.claude"
LINK_PATH="$CLAUDE_DIR/skills"
LINK_TARGET_PREFIX="../../.agents/skills"
DRY_RUN=false

print_usage() {
  echo "Usage: $0 [--dry-run]"
  echo ""
  echo "Ensure .claude/skills contains symlinks to each skill in .agents/skills."
  echo ""
  echo "Options:"
  echo "  --dry-run, -n   Show what would change without changing files"
  echo "  --help, -h      Show this help message"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run|-n)
      DRY_RUN=true
      shift
      ;;
    --help|-h)
      print_usage
      exit 0
      ;;
    *)
      echo "Error: Unknown option: $1" >&2
      print_usage >&2
      exit 1
      ;;
  esac
done

if [[ ! -d "$CANONICAL_DIR" ]]; then
  echo "Error: Canonical skills directory does not exist: $CANONICAL_DIR" >&2
  exit 1
fi

if [[ ! -d "$CLAUDE_DIR" ]]; then
  if [[ "$DRY_RUN" == true ]]; then
    echo "Would create: .claude"
  else
    mkdir -p "$CLAUDE_DIR"
  fi
fi

echo "Linking Claude skills to agents skills"
echo "Source of truth: .agents/skills"
echo "Target directory: .claude/skills"
echo ""

if [[ -L "$LINK_PATH" ]]; then
  if [[ "$DRY_RUN" == true ]]; then
    echo "Would replace directory-level symlink with a real .claude/skills directory."
    exit 0
  fi
  rm "$LINK_PATH"
  mkdir -p "$LINK_PATH"
elif [[ ! -e "$LINK_PATH" ]]; then
  [[ "$DRY_RUN" == false ]] && mkdir -p "$LINK_PATH"
elif [[ ! -d "$LINK_PATH" ]]; then
  echo "Error: .claude/skills exists but is not a directory or symlink." >&2
  exit 1
fi

created_count=0
replaced_count=0
unchanged_count=0

shopt -s nullglob
for skill_dir in "$CANONICAL_DIR"/*; do
  if [[ ! -d "$skill_dir" ]]; then
    continue
  fi

  skill_name="$(basename "$skill_dir")"
  claude_skill_path="$LINK_PATH/$skill_name"
  skill_link_target="$LINK_TARGET_PREFIX/$skill_name"

  if [[ -L "$claude_skill_path" ]]; then
    current_target="$(readlink "$claude_skill_path")"
    if [[ "$current_target" == "$skill_link_target" ]]; then
      echo "Already linked: $skill_name"
      unchanged_count=$((unchanged_count + 1))
      continue
    fi

    if [[ "$DRY_RUN" == true ]]; then
      echo "Would replace symlink: $skill_name"
    else
      rm "$claude_skill_path"
      ln -s "$skill_link_target" "$claude_skill_path"
      echo "Replaced symlink: $skill_name"
    fi
    replaced_count=$((replaced_count + 1))
    continue
  fi

  if [[ -e "$claude_skill_path" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "Would replace existing path: $skill_name"
    else
      rm -rf "$claude_skill_path"
      ln -s "$skill_link_target" "$claude_skill_path"
      echo "Replaced existing path: $skill_name"
    fi
    replaced_count=$((replaced_count + 1))
    continue
  fi

  if [[ "$DRY_RUN" == true ]]; then
    echo "Would link: $skill_name"
  else
    ln -s "$skill_link_target" "$claude_skill_path"
    echo "Linked: $skill_name"
  fi
  created_count=$((created_count + 1))
done

echo ""
echo "Done. Linked: $created_count, replaced: $replaced_count, unchanged: $unchanged_count."
