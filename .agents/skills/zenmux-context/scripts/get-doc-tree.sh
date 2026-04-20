#!/bin/bash
# get-doc-tree.sh - Generate structured documentation tree for ZenMux docs
#
# Outputs a tree of all .md files under en/ and zh/ with their first H1 heading.
# Used by the zenmux-context skill to understand available documentation.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_DIR="$SKILL_DIR/references/zenmux-doc/docs_source"

if [ ! -d "$DOCS_DIR" ]; then
  echo "ERROR: Documentation directory not found at $DOCS_DIR"
  echo "Run 'bash skills/zenmux-context/scripts/update-references.sh' first to clone the docs repo."
  exit 1
fi

for lang in en zh; do
  LANG_DIR="$DOCS_DIR/$lang"
  if [ ! -d "$LANG_DIR" ]; then
    echo "WARNING: $lang/ directory not found, skipping."
    continue
  fi

  echo "=== $lang ==="
  echo ""

  find "$LANG_DIR" -name "*.md" -type f | sort | while read -r filepath; do
    relpath="${filepath#$DOCS_DIR/}"
    title=$(grep -m 1 '^# ' "$filepath" | sed 's/^# //')
    if [ -n "$title" ]; then
      echo "  $relpath  --  $title"
    else
      echo "  $relpath"
    fi
  done

  echo ""
done
