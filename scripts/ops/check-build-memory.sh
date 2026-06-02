#!/usr/bin/env bash
set -euo pipefail

echo "== Build memory check =="
free -h
echo
echo "== Active swap =="
swapon --show || true
echo

echo "== Risky concurrent processes =="
ps -eo pid,ppid,%mem,%cpu,cmd --sort=-%mem | awk '
  $0 !~ /awk/ &&
  $0 !~ /check-build-memory\.sh/ &&
  ($0 ~ /next dev/ ||
   $0 ~ /next-server/ ||
   $0 ~ /\.next\/dev\/build\/postcss\.js/ ||
   $0 ~ /npm run typecheck/ ||
   $0 ~ /npm exec tsc --noEmit/ ||
   $0 ~ /node .*tsc --noEmit/) {
    print
    found=1
  }
  END {
    if (!found) print "none"
  }
'
echo

echo "== Advisory =="
echo "- Stop repo-local next dev and manual typecheck jobs before npm run build."
echo "- If swap is missing or the risky process list is non-empty, expect higher OOM risk."
echo "- This script only reports risk. It does not kill anything."
