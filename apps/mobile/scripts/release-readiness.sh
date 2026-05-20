#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== NurseNest mobile release readiness =="
npm run typecheck
npm run lint

if command -v npx >/dev/null 2>&1; then
  echo "== expo-doctor (non-fatal if network constrained) =="
  npx --yes expo-doctor || echo "expo-doctor exited non-zero; review output before store submit."
else
  echo "npx not found; skip expo-doctor."
fi

echo "== Done =="
