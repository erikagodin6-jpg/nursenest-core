#!/usr/bin/env bash
# Editor-only recovery: stop runaway Cursor remote extensionHost / fileWatcher processes.
# Does NOT kill app servers (next dev, tsx server, prisma, user npm scripts outside .cursor-server).
#
# After running: reload Cursor window (Command Palette → "Developer: Reload Window")
# and ensure the remote workspace folder is ONLY the repo clone, e.g. /root/nursenest-core

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

print_top_nodes() {
  local label="$1"
  echo ""
  echo "=== Top node-related processes (${label}) ==="
  if ! command -v ps >/dev/null 2>&1; then
    echo "(ps not available)"
    return
  fi
  # Header + rows that look like node/cursor-related, sorted by CPU
  ps -eo pid,pcpu,rss,args --sort=-pcpu 2>/dev/null | head -n 1
  ps -eo pid,pcpu,rss,args --sort=-pcpu 2>/dev/null | tail -n +2 | while read -r _line; do
    case "${_line}" in
      *node*|*cursor*|*code-server*) echo "${_line}" ;;
    esac
  done | head -n 18
  echo ""
}

kill_cursor_host_watchers() {
  local killed=0
  for proc in /proc/[0-9]*; do
    [[ -d "$proc" ]] || continue
    local pid="${proc##*/}"
    [[ "$pid" =~ ^[0-9]+$ ]] || continue
    [[ -r "$proc/cmdline" ]] || continue
    # cmdline is NUL-separated
    local cmd
    cmd="$(tr '\0' ' ' <"$proc/cmdline" 2>/dev/null || true)"
    [[ -n "$cmd" ]] || continue
    case "$cmd" in
      *cursor-server*|*/.cursor-server/*) ;;
      *) continue ;;
    esac
    case "$cmd" in
      *"--type=extensionHost"*|*"--type=fileWatcher"*) ;;
      *) continue ;;
    esac
    if kill -0 "$pid" 2>/dev/null; then
      echo "SIGTERM pid=$pid"
      # shellcheck disable=SC2086
      kill "$pid" 2>/dev/null || true
      killed=$((killed + 1))
    fi
  done
  echo "Signaled ${killed} Cursor extensionHost/fileWatcher process(es)."
}

clear_safe_cursor_caches() {
  local base="${HOME}/.cursor-server/data"
  if [[ ! -d "$base" ]]; then
    echo "No ${base} — nothing to clear (server data not on this host or different user)."
    return
  fi
  for sub in CachedExtensionVSIXs CachedData; do
    local d="${base}/${sub}"
    if [[ -d "$d" ]]; then
      # Remove contents only; keep the directory so the server can recreate it.
      find "$d" -mindepth 1 -maxdepth 1 -exec rm -rf {} + 2>/dev/null || true
      echo "Cleared cache directory: $d"
    fi
  done
}

echo "NurseNest Cursor remote recovery (repo: ${REPO_ROOT})"
print_top_nodes "before"

echo "--- Stopping Cursor extensionHost / fileWatcher only ---"
kill_cursor_host_watchers

echo "--- Clearing safe Cursor server caches (not workspaceStorage) ---"
clear_safe_cursor_caches

sleep 1
print_top_nodes "after ~1s"

echo ""
echo ">>> Reload Cursor: Command Palette → 'Developer: Reload Window'"
echo ">>> Remote folder: open ONLY your clone root, e.g. /root/nursenest-core (never /root as the workspace)."
echo ">>> Verify: cd ${REPO_ROOT} && npm run cursor:diagnose && npm run validate:editor-stability"
echo ""
