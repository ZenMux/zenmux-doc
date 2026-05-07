#!/usr/bin/env bash
# List ZenMux image generation models.
#
# Hits the Vertex AI–compatible model list endpoint and filters down to models
# whose `outputModalities` array contains "image". The output is a TSV table
# with columns: name, displayName, inputModalities, family.
#
# Usage:
#   bash scripts/list_models.sh                # human-readable table
#   bash scripts/list_models.sh --json         # raw JSON of just the image models
#   bash scripts/list_models.sh --names-only   # just the model names, one per line

set -euo pipefail

ENDPOINT="https://zenmux.ai/api/vertex-ai/v1beta/models"

mode="table"
case "${1:-}" in
  --json)       mode="json" ;;
  --names-only) mode="names" ;;
  --help|-h)
    sed -n '2,12p' "$0"
    exit 0
    ;;
  "") ;;
  *)
    echo "Unknown argument: $1" >&2
    exit 2
    ;;
esac

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: 'jq' is required but not found. Install with 'brew install jq'." >&2
  exit 1
fi

response=$(curl -sf --max-time 15 "$ENDPOINT") || {
  echo "Error: failed to reach $ENDPOINT" >&2
  exit 1
}

if ! echo "$response" | jq -e '.models | type == "array"' >/dev/null 2>&1; then
  echo "Error: unexpected response shape from $ENDPOINT" >&2
  echo "$response" | head -c 500 >&2
  echo >&2
  exit 1
fi

# Family is inferred from the model name prefix (the part before '/').
filter_expr='
  .models[]
  | select((.outputModalities // []) | index("image"))
  | {
      name: .name,
      displayName: (.displayName // ""),
      inputModalities: (.inputModalities // []),
      family: ((.name | split("/"))[0])
    }
'

case "$mode" in
  json)
    echo "$response" | jq "[ $filter_expr ]"
    ;;
  names)
    echo "$response" | jq -r "$filter_expr | .name"
    ;;
  table)
    {
      printf 'NAME\tDISPLAY_NAME\tINPUT_MODALITIES\tFAMILY\n'
      echo "$response" | jq -r "$filter_expr | [.name, .displayName, (.inputModalities | join(\",\")), .family] | @tsv"
    } | column -t -s $'\t'
    ;;
esac
