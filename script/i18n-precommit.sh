#!/bin/bash
#
# Pre-commit hook for hardcoded string detection.
#
# Setup instructions:
# 1. Install husky:    npx husky install
# 2. Add this hook:    npx husky add .husky/pre-commit "bash script/i18n-precommit.sh"
#
# Or manually copy to .git/hooks/pre-commit and make executable.
#
# This script runs the full i18n scanner with config-based thresholds.
# It will block the commit if violations exceed configured thresholds.
#

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(tsx?|ts)$' | grep '^client/src/' || true)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

echo "🔍 Scanning for hardcoded strings..."

npx tsx script/scan-hardcoded-strings.ts --no-json --ci
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "❌ Commit blocked: hardcoded string violations exceed thresholds."
  echo "   Run 'npx tsx script/scan-hardcoded-strings.ts' for the full report."
  echo ""
  exit 1
fi

exit 0
