#!/bin/bash

# Set variables
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$SKILL_DIR/../.." && pwd)"
REFERENCES_DIR="$SKILL_DIR/references"
REFERENCES_LIST="$REFERENCES_DIR/references-list.txt"
GITIGNORE_FILE="$PROJECT_ROOT/.gitignore"
# Dynamically compute .gitignore prefix (relative path from project root to references/)
GITIGNORE_PREFIX="$(python3 -c "import os; print(os.path.relpath('$REFERENCES_DIR', '$PROJECT_ROOT'))")"

# Check if references directory exists, create if not
if [ ! -d "$REFERENCES_DIR" ]; then
  echo "Creating .references directory..."
  mkdir -p "$REFERENCES_DIR"
fi

# Check if references-list.txt exists
if [ ! -f "$REFERENCES_LIST" ]; then
  echo "Error: $REFERENCES_LIST does not exist!"
  echo "Please create this file and add GitHub repository links, one per line."
  exit 1
fi

echo "Starting to process reference projects..."

# Read each line from references-list.txt
while IFS= read -r repo_url || [[ -n "$repo_url" ]]; do
  # Skip empty lines and comment lines
  if [[ -z "$repo_url" || "$repo_url" =~ ^# ]]; then
    continue
  fi

  echo "Processing repository: $repo_url"

  # Extract repository name from URL
  repo_name=$(basename "$repo_url" .git)
  target_dir="$REFERENCES_DIR/$repo_name"

  # Check if directory name is a path to be added to .gitignore
  gitignore_path="$GITIGNORE_PREFIX/$repo_name"

  # Check if already in .gitignore
  if ! grep -q "^$gitignore_path\$" "$GITIGNORE_FILE"; then
    echo "Adding $gitignore_path to .gitignore..."
    # Ensure the added entry is on a new line
    # First check if the file ends with a newline
    if [ -f "$GITIGNORE_FILE" ] && [ -s "$GITIGNORE_FILE" ]; then
      last_char=$(tail -c 1 "$GITIGNORE_FILE")
      if [ "$last_char" != "" ]; then
        # If the last line is not empty, add a newline first
        echo "" >> "$GITIGNORE_FILE"
      fi
    fi
    # Add ignore path
    echo "$gitignore_path" >> "$GITIGNORE_FILE"
  else
    echo "$gitignore_path is already in .gitignore"
  fi

  # Check if directory exists
  if [ -d "$target_dir" ]; then
    # Directory exists, try to update
    echo "Updating $repo_name..."
    cd "$target_dir" && git pull && cd - > /dev/null
  else
    # Directory does not exist, clone repository
    echo "Cloning $repo_name..."
    git clone "$repo_url" "$target_dir"
  fi

done < "$REFERENCES_LIST"

echo "All reference projects processed!"
