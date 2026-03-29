#!/bin/bash
cd /home/runner/workspace

LANGS="es zh ar hi ko pa vi ht ur ja fa de"

for lang in $LANGS; do
  remaining=999
  while [ $remaining -gt 0 ]; do
    output=$(node scripts/translate-chunk.mjs $lang 30 2>&1)
    echo "$output"
    remaining=$(echo "$output" | grep "Remaining:" | awk '{print $2}')
    if [ -z "$remaining" ]; then
      echo "ERROR: No remaining count found for $lang, skipping"
      break
    fi
  done
  echo "=== COMPLETED: $lang ==="
done
echo "ALL DONE"
