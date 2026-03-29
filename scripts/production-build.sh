#!/usr/bin/env bash
# Canonical production build for Render, Railway, and CI.
# Installs devDependencies (build toolchain), produces dist/, verifies artifacts, prunes for runtime.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[production-build] repo root: ${ROOT}"

rm -rf dist

heroku_stack() {
  case "${STACK:-}" in
    heroku-*) return 0 ;;
    *) return 1 ;;
  esac
}

if heroku_stack; then
  export SKIP_I18N_VALIDATION="${SKIP_I18N_VALIDATION:-1}"
  export SKIP_I18N_COMPILE="${SKIP_I18N_COMPILE:-1}"
  export SKIP_BUILD_REPORTS="${SKIP_BUILD_REPORTS:-1}"
  export VITE_SKIP_CIRCULAR_CHECK="${VITE_SKIP_CIRCULAR_CHECK:-1}"
  export RUN_HEAVY_BUILD_TASKS="${RUN_HEAVY_BUILD_TASKS:-0}"
  export SKIP_BUNDLE_SIZE_CHECK="${SKIP_BUNDLE_SIZE_CHECK:-1}"
  echo "[production-build] Heroku stack (${STACK}): lean defaults (set SKIP_BUNDLE_SIZE_CHECK=0 to enforce chunk guardrail)."
fi

# Platforms often set NODE_ENV=production, which would skip devDependencies on install.
echo "[production-build] npm ci..."
START_NPM_CI="$(date +%s)"
NODE_ENV=development npm ci
echo "[deploy-timing] npm_ci_s=$(( $(date +%s) - START_NPM_CI ))"

export NODE_ENV=production
export SKIP_I18N_VALIDATION="${SKIP_I18N_VALIDATION:-1}"
export SKIP_I18N_COMPILE="${SKIP_I18N_COMPILE:-1}"
export SKIP_BUILD_REPORTS="${SKIP_BUILD_REPORTS:-1}"
export VITE_SKIP_CIRCULAR_CHECK="${VITE_SKIP_CIRCULAR_CHECK:-1}"
export RUN_HEAVY_BUILD_TASKS="${RUN_HEAVY_BUILD_TASKS:-0}"

echo "[production-build] npm run build..."
START_BUILD="$(date +%s)"
npm run build
echo "[deploy-timing] npm_run_build_s=$(( $(date +%s) - START_BUILD ))"

if [ "${SKIP_BUNDLE_SIZE_CHECK:-0}" = "1" ]; then
  echo "[production-build] skipping check:bundle-size (SKIP_BUNDLE_SIZE_CHECK=1)"
else
  echo "[production-build] check:bundle-size..."
  START_BUNDLE="$(date +%s)"
  npm run check:bundle-size
  echo "[deploy-timing] check_bundle_size_s=$(( $(date +%s) - START_BUNDLE ))"
fi
npm prune --production

echo "[production-build] complete"
