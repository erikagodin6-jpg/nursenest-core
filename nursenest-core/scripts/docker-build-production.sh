#!/usr/bin/env bash
# Production Docker builder stage — one Next compile + standalone packaging + prod prune.
# Invoked from repo-root Dockerfile (WORKDIR /app/nursenest-core).
set -euxo pipefail

log() {
  printf '[docker-build-production] %s\n' "$*" >&2
}

require_dir() {
  local label="$1"
  local dir="$2"
  if [[ ! -d "$dir" ]]; then
    log "FATAL: missing directory (${label}): ${dir}"
    exit 1
  fi
  log "ok dir ${label}=${dir}"
}

require_file() {
  local label="$1"
  local file="$2"
  if [[ ! -f "$file" ]]; then
    log "FATAL: missing file (${label}): ${file}"
    exit 1
  fi
  log "ok file ${label}=${file} size=$(wc -c <"$file" | tr -d ' ') bytes"
}

on_err() {
  local exit_code=$?
  log "FAILED exit_code=${exit_code} at line ${BASH_LINENO[0]} (command: ${BASH_COMMAND:-unknown})"
  log "hint: search BuildKit logs for the last [docker-build-production] step name"
  if [[ -d .next ]]; then
    log "post-mortem .next listing:"
    ls -la .next 2>/dev/null || true
    ls -la .next/standalone 2>/dev/null || true
  fi
  if command -v free >/dev/null 2>&1; then
    free -m 2>/dev/null || true
  fi
  exit "$exit_code"
}
trap on_err ERR

export BUILD_WEBPACK_PARALLELISM="${BUILD_WEBPACK_PARALLELISM:-1}"
export NN_FORCE_SINGLE_BUILD_WORKER="${NN_FORCE_SINGLE_BUILD_WORKER:-true}"

log "step=preflight pwd=$(pwd) node=$(node -v) npm=$(npm -v)"
log "env BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=${BUILD_NODE_MAX_OLD_SPACE_SIZE_MB:-unset}"
log "env NN_LOW_MEMORY_BUILD=${NN_LOW_MEMORY_BUILD:-unset} NN_APP_PLATFORM_BUILD=${NN_APP_PLATFORM_BUILD:-unset}"
if [[ -f scripts/build-env-fingerprint.mjs ]]; then
  node scripts/build-env-fingerprint.mjs || true
fi

log "step=clean_build_caches"
rm -rf .next .turbo node_modules/.cache

log "step=heroku_postbuild (npm run heroku-postbuild → single next production compile)"
npm run heroku-postbuild

log "step=verify_standalone_after_compile"
require_dir "next_out" ".next"
require_dir "standalone_tree" ".next/standalone"
node --input-type=module -e "
import { resolveStandaloneServerPath } from './scripts/verify-standalone-artifact.mjs';
const p = resolveStandaloneServerPath(process.cwd());
if (!p) { console.error('[docker-build-production] FATAL: no server.js under .next/standalone'); process.exit(1); }
console.error('[docker-build-production] standalone_server=' + p);
"

log "step=build_deploy (post-compile: static sync, verify, prune metadata — no second next build)"
npm run build:deploy

log "step=verify_standalone_before_tar"
require_dir "standalone_tree" ".next/standalone"

log "step=package_standalone_tarball"
tar -C .next -czf .next-standalone-runtime.tar.gz standalone
require_file "standalone_tarball" ".next-standalone-runtime.tar.gz"

log "step=remove_standalone_tree (runtime unpacks tarball in runner stage)"
rm -rf .next/standalone
if [[ -d .next/standalone ]]; then
  log "FATAL: .next/standalone still present after rm"
  exit 1
fi

log "step=npm_prune_production"
npm prune --omit=dev --no-fund --no-audit

log "step=clean_compile_caches"
rm -rf .next/cache .turbo node_modules/.cache

log "step=done ok=1"
