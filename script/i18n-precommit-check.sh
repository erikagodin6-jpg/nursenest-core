#!/usr/bin/env bash
# Pre-commit guard for the i18n pipeline:
# - If you stage any i18n pipeline file, all edits under those paths must be staged (no mixed state).
# - If you stage sources or bundles, run i18n:check-sync so client/en.json matches monolith + marketing.
#
# Emergency bypass: SKIP_I18N_PRECOMMIT=1 git commit …
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if [[ "${SKIP_I18N_PRECOMMIT:-}" == "1" ]]; then
  echo "[i18n] SKIP_I18N_PRECOMMIT=1 — skipping i18n pre-commit guardrails"
  exit 0
fi

I18N_PATHS=(
  "client/public/i18n"
  "tools/i18n/marketing"
  "tools/i18n/source"
  "nursenest-core/public/i18n"
  "tools/i18n/reports/placeholder-fallbacks.json"
  "nursenest-core/src/lib/i18n/marketing-message-keys.generated.ts"
)

staged_i18n="$(git diff --cached --name-only -- "${I18N_PATHS[@]}" 2>/dev/null || true)"
unstaged_i18n="$(git diff --name-only -- "${I18N_PATHS[@]}" 2>/dev/null || true)"
untracked_i18n="$(git ls-files -o --exclude-standard -- "${I18N_PATHS[@]}" 2>/dev/null || true)"

if [[ -n "$staged_i18n" ]]; then
  if [[ -n "$unstaged_i18n" ]]; then
    echo "Commit blocked: you have both staged and unstaged changes under i18n pipeline paths."
    echo "Stage the full set (e.g. after npm run i18n:compile): git add client/public/i18n tools/i18n/marketing nursenest-core/public/i18n …"
    echo ""
    echo "Unstaged:"
    echo "$unstaged_i18n"
    exit 1
  fi
  if [[ -n "$untracked_i18n" ]]; then
    echo "Commit blocked: staged i18n pipeline changes but untracked files remain:"
    echo ""
    echo "$untracked_i18n"
    echo "Add them with git add or remove before committing."
    exit 1
  fi
  npm run -s i18n:check-sync
fi
