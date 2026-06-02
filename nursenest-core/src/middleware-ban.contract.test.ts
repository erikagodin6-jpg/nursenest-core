/**
 * MIDDLEWARE BAN — REPOSITORY CONTRACT TEST
 *
 * src/middleware.ts is permanently banned from this repository.
 *
 * WHY THIS TEST EXISTS
 * --------------------
 * `src/middleware.ts` has been accidentally recreated 6 times by AI-assisted commits.
 * The pattern: a large multi-file refactor includes middleware.ts as a "helpful fix"
 * because the AI's training data associates Next.js projects with needing middleware.ts.
 *
 * WHAT IS CORRECT
 * ---------------
 * This project uses `src/proxy.ts` as the Next.js edge middleware entry point.
 * Next.js 16+ recognises `proxy.ts` directly. When BOTH proxy.ts AND middleware.ts
 * exist simultaneously, `next build` hard-fails with:
 *   "Both middleware file ... and proxy file ... are detected"
 *
 * WHAT IS BANNED
 * --------------
 * src/middleware.ts (or src/middleware.js) must never exist.
 * It is in .gitignore so git will refuse to stage it.
 *
 * RUN
 * ---
 *   npm run verify:no-middleware
 *   node --import tsx --test src/middleware-ban.contract.test.ts
 *
 * See: docs/reports/middleware-regeneration-root-cause.md
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const srcRoot = dir; // This file lives in src/

// ── MIDDLEWARE.TS MUST NOT EXIST ─────────────────────────────────────────────

test("src/middleware.ts does not exist [PERMANENT BAN]", () => {
  const middlewareTs = join(srcRoot, "middleware.ts");
  const middlewareJs = join(srcRoot, "middleware.js");

  const tsExists = existsSync(middlewareTs);
  const jsExists = existsSync(middlewareJs);

  if (tsExists || jsExists) {
    const found = [tsExists && "middleware.ts", jsExists && "middleware.js"]
      .filter(Boolean)
      .join(", ");
    assert.fail(
      `\n\n` +
      `  ╔═══════════════════════════════════════════════════════════════╗\n` +
      `  ║  BANNED FILE DETECTED: src/${found.padEnd(36)} ║\n` +
      `  ╠═══════════════════════════════════════════════════════════════╣\n` +
      `  ║  This file is permanently banned from this repository.       ║\n` +
      `  ║                                                               ║\n` +
      `  ║  Use src/proxy.ts — it IS the Next.js edge middleware.       ║\n` +
      `  ║  Next.js 16+ recognises proxy.ts directly.                   ║\n` +
      `  ║  Having BOTH proxy.ts + middleware.ts causes build failure.  ║\n` +
      `  ║                                                               ║\n` +
      `  ║  To fix: git rm src/middleware.ts && git commit              ║\n` +
      `  ║                                                               ║\n` +
      `  ║  Root cause: docs/reports/middleware-regeneration-root-cause.md ║\n` +
      `  ╚═══════════════════════════════════════════════════════════════╝\n`,
    );
  }
});

// ── PROXY.TS MUST EXIST AND BE CORRECTLY WIRED ───────────────────────────────

test("src/proxy.ts exists (the correct middleware entry point)", () => {
  const proxyPath = join(srcRoot, "proxy.ts");
  assert.ok(
    existsSync(proxyPath),
    "src/proxy.ts must exist — it is the Next.js edge middleware entry point for this repo",
  );
});

test("src/proxy.ts exports 'proxy' function and 'config' with matcher", () => {
  const proxyPath = join(srcRoot, "proxy.ts");
  const src = readFileSync(proxyPath, "utf-8");

  assert.ok(
    src.includes("export async function proxy") || src.includes("export function proxy"),
    "proxy.ts must export a function named 'proxy'",
  );

  assert.ok(
    src.includes("export const config"),
    "proxy.ts must export 'config' (Next.js middleware config with matcher array)",
  );

  assert.ok(
    src.includes("matcher"),
    "proxy.ts config must include a 'matcher' array so Next.js activates the middleware",
  );
});

test("src/proxy.ts does not re-export from a middleware.ts shim", () => {
  const proxyPath = join(srcRoot, "proxy.ts");
  const src = readFileSync(proxyPath, "utf-8");

  assert.ok(
    !src.includes("from \"./middleware\"") && !src.includes("from './middleware'"),
    "proxy.ts must not import from middleware.ts — middleware.ts does not exist",
  );
});

// ── NEXT.JS BUILD COLLISION GUARD ────────────────────────────────────────────

test("next.config.mjs does not force-register middleware.ts separately", () => {
  const configPath = join(srcRoot, "..", "next.config.mjs");
  if (!existsSync(configPath)) return; // Not in this working directory

  const src = readFileSync(configPath, "utf-8");

  // If next.config explicitly references middleware.ts it would cause dual-registration
  assert.ok(
    !src.includes("middleware.ts"),
    "next.config.mjs must not reference middleware.ts — use proxy.ts only",
  );
});
