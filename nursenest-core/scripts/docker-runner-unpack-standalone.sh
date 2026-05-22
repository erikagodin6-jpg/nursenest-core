#!/bin/sh
# Runner stage: unpack builder tarball into .next/standalone (POSIX sh — no Node imports).
set -eu

log() {
  printf '[docker-runner-unpack] %s\n' "$*" >&2
}

resolve_server_js() {
  if [ -f .next/standalone/nursenest-core/server.js ]; then
    echo ".next/standalone/nursenest-core/server.js"
    return 0
  fi
  if [ -f .next/standalone/server.js ]; then
    echo ".next/standalone/server.js"
    return 0
  fi
  log "FATAL: no server.js under .next/standalone (checked nursenest-core/ and top-level)"
  find .next/standalone -name server.js ! -path '*/node_modules/*' 2>/dev/null | head -20 >&2 || true
  return 1
}

log "step=preflight pwd=$(pwd)"
if [ ! -f scripts/docker-runner-unpack-standalone.sh ]; then
  log "FATAL: unpack script missing from image context"
  exit 1
fi
if [ ! -f .next-standalone-runtime.tar.gz ]; then
  log "FATAL: missing .next-standalone-runtime.tar.gz (builder stage did not produce tarball)"
  exit 1
fi
log "ok tarball bytes=$(wc -c <.next-standalone-runtime.tar.gz | tr -d ' ')"

log "step=extract_standalone_tarball"
mkdir -p .next
tar -xzf .next-standalone-runtime.tar.gz -C .next
rm -f .next-standalone-runtime.tar.gz

if [ ! -d .next/standalone ]; then
  log "FATAL: .next/standalone missing after tar extract"
  ls -la .next 2>/dev/null >&2 || true
  exit 1
fi
log "ok dir .next/standalone"

server_js=$(resolve_server_js) || exit 1
log "ok standalone_server=${server_js}"

log "step=done ok=1"
