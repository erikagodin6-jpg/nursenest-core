#!/usr/bin/env node
/**
 * Warn when heavy compile tasks run from an IDE-integrated terminal (memory + watcher pressure on the host).
 * Never fails the build unless --strict is passed.
 */

function looksLikeCursorOrVsCodeTerminal() {
  if (/^(1|true|yes)$/i.test(String(process.env.NN_SKIP_IDE_HEAVY_BUILD_WARN ?? "").trim())) return false;
  if (String(process.env.CI ?? "").trim() === "1" || process.env.GITHUB_ACTIONS === "true") return false;

  if (String(process.env.CURSOR_TRACE_ID ?? "").trim()) return true;
  if (String(process.env.CURSOR_AGENT ?? "").trim()) return true;
  const ipc = String(process.env.VSCODE_IPC_HOOK_CLI ?? "");
  if (/cursor/i.test(ipc)) return true;
  if (String(process.env.TERM_PROGRAM ?? "").toLowerCase() === "cursor") return true;

  return false;
}

function main() {
  const strict = process.argv.includes("--strict");
  if (!looksLikeCursorOrVsCodeTerminal()) return 0;

  console.warn(
    "[nn-dev] Heavy Next.js build detected in an IDE-integrated terminal. Prefer a system/SSH terminal for " +
      "`npm run build` / `next build` / content generators to reduce Cursor disconnects (memory + file watchers).",
  );
  if (strict) {
    console.error("[nn-dev] FATAL: strict mode (NN_SKIP_IDE_HEAVY_BUILD_WARN unset and --strict passed).");
    return 1;
  }
  return 0;
}

process.exit(main());
