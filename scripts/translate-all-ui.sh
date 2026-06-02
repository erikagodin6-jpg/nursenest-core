#!/bin/bash
cd /home/runner/workspace

LANGS="tr ja ur fa ht de zh zh-tw ko pt pa vi ar hi es tl id fr th"

for lang in $LANGS; do
  echo "=== Starting $lang at $(date) ==="
  remaining=999
  while [ $remaining -gt 0 ]; do
    output=$(node scripts/translate-ui-strings.mjs $lang 8 2>&1)
    echo "$output"
    # Check if "complete" or "0 keys remaining" appears
    if echo "$output" | grep -q "complete\|0 keys remaining"; then
      remaining=0
    else
      # Extract remaining count from output
      rem=$(echo "$output" | grep -oP '\d+ keys remaining' | head -1 | awk '{print $1}')
      if [ -n "$rem" ]; then
        remaining=$rem
      else
        remaining=0
      fi
    fi
  done
  echo "=== DONE: $lang at $(date) ==="
done
echo "ALL LANGUAGES COMPLETE"
